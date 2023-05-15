echo Building feedme-tech-test:base
docker build -t feedme-tech-test:base -f Dockerfile.base .

echo Building feedme-tech-test:reader
docker build -t feedme-tech-test:reader -f Dockerfile.reader .

echo Building feedme-tech-test:consumer
docker build -t feedme-tech-test:consumer -f Dockerfile.consumer .

echo Building feedme-tech-test:feedme-viewer
docker build -t feedme-tech-test:feedme-viewer -f Dockerfile.feedme-viewer .

echo
echo
echo "All images built. Run 'docker compose up' to start the stack."
