import chromadb

client = chromadb.PersistentClient("./chroma_data/")
collection = client.get_or_create_collection(name="resume_data")

def store(chunks, embedding):
    global collection
    IDs = []
    for i in range(len(chunks)):
        IDs.append("chunk_"+str(i))
    client.delete_collection("resume_data")
    collection = client.get_or_create_collection(name="resume_data")
    collection.add(ids=IDs, documents=chunks, embeddings=embedding)

def retrive(query_embeddings, k):
    ans = collection.query(
        query_embeddings = query_embeddings,
        n_results=k
    )
    return ans