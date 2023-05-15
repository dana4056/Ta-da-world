# 🎉 TA-DA WORLD 포팅 매뉴얼

## 👨🏻 Jenkins

- Jenkins 2.387.3
- Docker 23.0.5

1. GitLab Push
2. Webhook 동작
3. Pipeline 실행
   1. Clone Repository
   2. Build Gradle or Yarn
   3. Build Docker
   4. Upload Dockerhub
   5. Connect SSH (build Freestyle project)
4. SSH server Exec command 실행
   1. Docker pull
   2. Docker container run

## 💚 Nginx

- Nginx 1.18.0
- Docker 23.0.5

- 도메인: https://ta-da.world
- SSL: [certbot](https://gist.github.com/woorim960/dda0bc85599f61a025bb8ac471dfaf7a)

### sites-enabled/default

```
server {
        root /var/www/html;
        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                # try_files $uri $uri/ =404;

                #proxy_pass http://localhost:3000;
                #proxy_set_header X-Real-IP $remote_addr;
                #proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                #proxy_http_version 1.1;
                #proxy_set_header Upgrade $http_upgrade;
                #proxy_set_header Connection "upgrade";
                #proxy_set_header Host $http_host;

                root /usr/share/nginx/html/build;
                index index.html index.htm;
                try_files $uri $uri/ /index.html;
        }
        location /api {
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_http_version 1.1;
                proxy_set_header X-Real-IP $remote_addr; # 실제 접속 IP
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_pass http://localhost:8080;
        }
        location /papi {
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
                proxy_http_version 1.1;
                proxy_set_header X-Real-IP $remote_addr; # 실제 접속 IP
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header Host $http_host;
                proxy_pass http://localhost:8000;
        }
}

```

---

## 💛 Backend - Spring Boot 배포

- JVM 11
- Springboot 2.7.12
- Gradle 7.6.1
- MySQL 8.0.32

### ⚙ application.yml

#### applcation-aws.yml

```
cloud:
  aws:
    credentials:
      secret-key: [SECRET KEY]
      access-key: [ACCESS KEY]
    s3:
      bucket: [S3 BUCKET NAME]
    region:
      static: ap-northeast-2
    stack:
      auto: 'false'
```

#### application-db.yml

```
spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    username: [USER NAME]
    url: jdbc:mysql://[RDS 엔드포인트]:3306/[SCHEMA NAME]?serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    password: [PASSWORD]
  jpa:
    database: mysql
    properties:
      hibernate:
        format_sql: 'true'
        use_sql_comments: 'true'
        show_sql: 'true'
    database-platform: org.hibernate.dialect.MySQL5InnoDBDialect
```

#### application-python.yml

```
environments:
  python:
    url: https://ta-da.world/papi
```

### 🐳 Dockerfile

```
FROM openjdk:11
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### 👨🏻 Jenkinsfile

```
pipeline {
    agent any
    post {
    failure {
        updateGitlabCommitStatus name: 'build', state: 'failed'
        }
    success {
        updateGitlabCommitStatus name: 'build', state: 'success'
        }
    }
    environment {
        repository = "jaehui327/tada-back"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        imagename = "tada-back"
    }
    stages {
        stage('Running') {
            steps {
                updateGitlabCommitStatus name: 'build', state: 'running'
            }
        }
        stage('Clone Repository') {
            steps {
                echo "Clonning Repository"
                git url: 'https://lab.ssafy.com/s08-final/S08P31A503.git',
                branch: 'dev-back',
                 credentialsId: '95086913-a1b2-4c08-8a34-382f19454773'
            }
            post {
                success {
                    echo 'Successfully Cloned Repository'
                }
                failure {
                    error '[Error] Clone Repository'
                }
            }
        }
        stage('Build Gradle') {
            steps {
                sh 'cp /var/lib/jenkins/workspace/backend/application-aws.yml backend/tada/src/main/resources/'
                sh 'cp /var/lib/jenkins/workspace/backend/application-db.yml backend/tada/src/main/resources/'
                sh 'cp /var/lib/jenkins/workspace/backend/application-python.yml backend/tada/src/main/resources/'
                dir ('backend/tada') {
                    echo 'Build Gradle'
                    sh 'pwd'
                    sh 'chmod +x gradlew'
                    sh './gradlew clean build'
                }
            }
            post {
                failure {
                    error '[Error] Build Gradle'
                }
            }
        }
        stage('Build Docker') {
            steps {
                dir ('backend/tada') {
                    echo 'Build Docker'
                    script {
                        dockerImage = docker.build repository + ":latest"
                    }
                }
            }
            post {
                failure {
                    error '[Error] Build Docker'
                }
            }
        }
        stage('Upload Dockerhub') {
            steps {
                dir ('backend/tada') {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push $repository:latest'
                    sh 'docker rmi $repository:latest'
                }
            }
        }
        stage('Connect SSH') {
            steps {
                build 'tada-back-2'
            }
        }
    }
}
```

## SSH server Exec command

```
sudo docker pull jaehui327/tada-back:latest
sudo docker kill tada-back
sudo docker rm tada-back
sudo docker container run -d --name tada-back -p 8080:8080 jaehui327/tada-back:latest
sudo docker image prune -f
```

---

## 💛 Backend - FastAPI 배포

- Python 3.8.6
- fastapi 0.95.1
- OpenCV 4.7.0.72
- PyTorch 2.0.0

### 🐳 Dockerfile

```
FROM python:3.10

WORKDIR /app/

COPY ./main.py /app/
COPY ./img/ /app/img/
COPY ./models/ /app/models/
COPY ./requirements.txt /app/

RUN apt-get update
RUN apt-get -y install libgl1-mesa-glx
RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--root-path", "/papi"]
```

### 👨🏻 Jenkinsfile

```
pipeline {
    agent any
    post {
    failure {
        updateGitlabCommitStatus name: 'build', state: 'failed'
        }
    success {
        updateGitlabCommitStatus name: 'build', state: 'success'
        }
    }
    environment {
        repository = 'jaehui327/tada-back-python'
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        imagename = 'tada-back-python'
    }
    stages {
        stage('Running') {
            steps {
                updateGitlabCommitStatus name: 'build', state: 'running'
            }
        }
        stage('Clone Repository') {
            steps {
                echo 'Clonning Repository'
                git url: 'https://lab.ssafy.com/s08-final/S08P31A503.git',
                branch: 'dev-back-python',
                 credentialsId: '95086913-a1b2-4c08-8a34-382f19454773'
            }
            post {
                success {
                    echo 'Successfully Cloned Repository'
                }
                failure {
                    error '[Error] Clone Repository'
                }
            }
        }
        stage('Build Docker') {
            steps {
                sh 'cp /var/lib/jenkins/workspace/python/.aws backend/python/ -r'
                dir ('backend/python') {
                    echo 'Build Docker'
                    script {
                        dockerImage = docker.build repository + ":latest"
                    }
                }
            }
            post {
                failure {
                    error '[Error] Build Docker'
                }
            }
        }
        stage('Upload Dockerhub') {
            steps {
                dir ('backend/python') {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push $repository:latest'
                    sh 'docker rmi $repository:latest'
                }
            }
        }
        stage('Connect SSH') {
            steps {
                build 'tada-back-python-2'
            }
        }
    }
}
```

### SSH server Exec command

```
sudo docker kill tada-back-python
sudo docker rm tada-back-python
sudo docker rmi jaehui327/tada-back-python:latest -f
sudo docker container run -d --name tada-back-python -p 8000:8000 jaehui327/tada-back-python:latest
```

---

## 💚 Frontend 배포

- Node LTS 18.16.0
- Yarn 1.22.19

### ⚙ .env

```
REACT_APP_API_KEY_KAKAO = [KAKAO API KEY]
REACT_APP_REDIRECT_URI = [LOCAL REDIRECT URI]
REACT_APP_REDIRECT_URI_SITE = [REDIRECT URI]
REACT_APP_LOGOUT_REDIRECT_URL = [LOCAL LOGOUT REDIRECT URL]
REACT_APP_LOGOUT_REDIRECT_URI_SITE = [LOGOUT REDIRECT URI]
REACT_APP_KAKAOMAP_API_KEY = [KAKAOMAP API KEY]

```

### 🐳 Dockerfile

```
FROM node:18.16.0
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["yarn", "start"]
```

### 👨🏻 Jenkinsfile

```
pipeline {
    agent any
    post {
    failure {
        updateGitlabCommitStatus name: 'build', state: 'failed'
        }
    success {
        updateGitlabCommitStatus name: 'build', state: 'success'
        }
    }
    environment {
        repository = "jaehui327/tada-front"
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        imagename = "tada-front"
    }
    tools {
        nodejs 'node 18.16.0'
    }
    stages {
         stage('Running') {
            steps {
                updateGitlabCommitStatus name: 'build', state: 'running'
                cleanWs()
            }
        }
        stage('Clone Repository') {
            steps {
                echo "Clonning Repository"
                git url: 'https://lab.ssafy.com/s08-final/S08P31A503.git',
                branch: 'dev-front',
                 credentialsId: '95086913-a1b2-4c08-8a34-382f19454773'
            }
            post {
                success {
                    echo 'Successfully Cloned Repository'
                }
                failure {
                    error '[Error] Clone Repository'
                }
            }
        }
        stage('Build Yarn') {
            steps {
                sh 'cp /var/lib/jenkins/workspace/frontend/.env frontend/tada/'
                dir ('frontend/tada') {
                    echo 'Build Yarn'
                    sh 'pwd'
                    sh 'node -v'
                    sh 'npm -v'
                    sh 'npm install -g yarn'
                    sh 'yarn -v'
                    sh 'yarn install'
                    sh 'CI=false yarn build'
                }
            }
            post {
                failure {
                    error '[Error] Build Yarn'
                }
            }
        }
        stage('Build Docker') {
            steps {
                dir ('frontend/tada') {
                    echo 'Build Docker'
                    script {
                        dockerImage = docker.build repository + ":latest"
                    }
                }
            }
            post {
                failure {
                    error '[Error] Build Docker'
                }
            }
        }
        stage('Upload Dockerhub') {
            steps {
                dir ('frontend/tada') {
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
                    sh 'docker push $repository:latest'
                    sh 'docker rmi $repository:latest'
                }
            }
        }
        stage('Connect SSH') {
            steps {
                build 'tada-front-2'
            }
        }
    }
}
```

### SSH server Exec command

```
sudo docker kill tada-front
sudo docker rm tada-front
sudo docker rmi jaehui327/tada-front:latest
sudo docker pull jaehui327/tada-front:latest
sudo docker container run -d --name tada-front -p 3000:3000 jaehui327/tada-front:latest
sudo rm -r -d /usr/share/nginx/html/build/
sudo docker cp tada-front:app/build /usr/share/nginx/html
sudo service nginx restart
```
