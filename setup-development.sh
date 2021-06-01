npm install -g concurrently
npm install
cd db
docker build -t villosum-db
docker run -d -p 5984:5984 --name villosum-db-local villosum-db