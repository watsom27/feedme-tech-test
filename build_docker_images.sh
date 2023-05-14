docker build -t feedme-tech-test:base -f Dockerfile.base .
docker build -t feedme-tech-test:reader -f Dockerfile.reader .
docker build -t feedme-tech-test:consumer -f Dockerfile.consumer .
