FROM python:3.10

WORKDIR /app/

COPY ./main.py /app/
COPY ./requirements.txt /app/

RUN pip install -r requirements.txt

EXPOSE 8000
CMD ["uvicorn", "main:app", "--reload"]