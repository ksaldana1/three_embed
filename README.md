# three.js embedding visualizer

Visualization of embeddings in 3D. Movie information pulled from [omdb](https://www.omdbapi.com/), ran through [OpenAI embedding models](https://platform.openai.com/docs/guides/embeddings), then reduced to 3 dimensions using [UMAP](https://umap-learn.readthedocs.io/en/latest/). Embeddings stored in Postgres using [pgvector](https://github.com/pgvector/pgvector) to drive distance / neighbor calculations.

Inspired by watching one too many 3Blue1Brown videos.
