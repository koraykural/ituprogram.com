docker build -t koraykural/ituprogram-client-main ./client-main
docker build -t koraykural/ituprogram-client-new ./client-new
docker build -t koraykural/ituprogram-client-archive ./client-archive
docker build -t koraykural/ituprogram-api ./server
docker build -t koraykural/ituprogram-update-service ./update-service
docker build -t koraykural/ituprogram-nginx ./nginx
docker push koraykural/ituprogram-api
docker push koraykural/ituprogram-nginx
docker push koraykural/ituprogram-client-main
docker push koraykural/ituprogram-client-new
docker push koraykural/ituprogram-client-archive
docker push koraykural/ituprogram-update-service
