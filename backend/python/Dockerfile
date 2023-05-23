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