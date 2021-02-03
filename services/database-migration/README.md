# Database Migration Service

The database migration service is used to migrate the AWS Aurora Postgres cluster whenever the the migrations change. The lambda function downloads the migrations from S3 unzips them and executes them using the Prisma ClI.

This service uses plain Javascript since it is just a single function.