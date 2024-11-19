# Final Year Project 

## LabelChain ( project name )

## Team Member 

1. Anurakt Singh : Frontend + Backend 
2. Akansha Sen : Frontend 
3. Abhishek Parmar : UI / UX 
4. Aish Mishra : Blockchain + Backend 

## Functions : 

1. Upload photos/assets => s3 + pre-signed URLs
2. Solana => pay via solana , dispense via sol 
3. Solana wallet adapter 
4. how to do this via smart contracts 
5. Handling Payments 
6. next js 

## web2 bits : 

1. s3 / object stores 
2. Pre-signed URLs 
3. CDNs ( content dilevery network )
4. HTTP Server 
5. DBs 
6. Async architecture / worker 

## web3 bits : 

1. Wallet adapter 
2. Signed message 
3. Transaction and signed transaction 
4. Indexing blockchain 
5. RPCs 
6. Worker talking to blockchain 

## Important bits : 

1. Letting user upload a photo 
2. Letting user pay and verify payments via backend 
3. Allowing labeller to payout $doller to their own wallet 

## Architecture : 

1. We won't be putting the images uploaded directly in the backend as :-
     1. its is a security vurlarability 
     2. it can fill up your servers ( say a single file could be in GBs )
     3. can't create a distributed system ( meaning that u can't have multiple backends )

2. We will be using aws object store 

### What is object storage?

Object storage is a technology that stores and manages data in an unstructured format called objects. Modern organizations create and analyze large volumes of unstructured data such as photos, videos, email, web pages, sensor data, and audio files. Cloud object storage systems distribute this data across multiple physical devices but allow users to access the content efficiently from a single, virtual storage repository. Object storage solutions are ideal for building cloud native applications that require scale and flexibility, and can also be used to import existing data stores for analytics, backup, or archive. 

