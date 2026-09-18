# Research notes for concepts 51–100

Authoring date: 2026-09-18. The lessons use original architecture analysis and illustrative industry scenarios; they do not claim measured customer outcomes. Primary documentation and original papers support the underlying mechanisms. Provider and engine capabilities are described without fixed pricing, retention, or release-wide compatibility promises.

Key distinctions checked against primary sources: speculative decoding depends on workload; GGUF is a format rather than a quantization method; trained Self-RAG differs from a generic critique loop; HyDE output is a retrieval aid rather than evidence; prompt packing differs from engine batching; distributed model memory differs from durable agent state; provider prefix caching has model-specific controls and accounting.

Mermaid validation uses the installed parser. Browser rendering is part of the parent integration validation; the Node parser alone does not test visual layout.

| Source | Concepts |
| --- | --- |
| [AWQ: Activation-aware Weight Quantization](https://arxiv.org/abs/2306.00978) | 82, 84 |
| [AWS Builders Library: Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/) | 51, 52, 57, 58, 60, 89 |
| [AWS Builders Library: Timeouts, retries and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) | 52, 56, 58, 59, 60, 81 |
| [Claude Platform: Prompt caching](https://platform.claude.com/docs/en/build-with-claude/prompt-caching) | 94, 99 |
| [Debezium architecture](https://debezium.io/documentation/reference/3.1/architecture.html) | 77 |
| [GGUF format specification](https://github.com/ggml-org/ggml/blob/master/docs/gguf.md) | 84 |
| [Hugging Face PEFT quantization guide](https://huggingface.co/docs/peft/developer_guides/quantization) | 90 |
| [KServe: Generative inference autoscaling examples](https://kserve.github.io/website/docs/next/model-serving/generative-inference/llmisvc/autoscaling/llmisvc-autoscaling-examples) | 89, 91 |
| [Kubernetes Network Policies](https://kubernetes.io/docs/concepts/services-networking/network-policies/) | 98 |
| [Kubernetes: Liveness, readiness and startup probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/) | 53, 54, 59, 60, 85, 89, 91 |
| [LLMLingua: Compressing Prompts for Accelerated Inference](https://arxiv.org/abs/2310.05736) | 71, 80 |
| [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) | 90, 100 |
| [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) | 64, 70, 71, 75, 78 |
| [MLflow Model Registry workflows](https://www.mlflow.org/docs/latest/ml/model-registry/workflow/) | 93, 100 |
| [Microsoft GraphRAG: Indexing overview](https://microsoft.github.io/graphrag/index/overview/) | 67, 68 |
| [Milvus consistency](https://milvus.io/docs/consistency.md) | 77 |
| [Milvus: Consistency levels](https://milvus.io/docs/consistency.md) | 69 |
| [Milvus: Filtered search](https://milvus.io/docs/filtered-search.md) | 63, 68, 69 |
| [Milvus: Multi-vector hybrid search](https://milvus.io/docs/multi-vector-search.md) | 62, 66, 69, 76, 92 |
| [NVIDIA NeMo Guardrails overview](https://docs.nvidia.com/nemo/guardrails/latest/index.html) | 97 |
| [NVIDIA Triton: TensorRT-LLM backend](https://docs.nvidia.com/deeplearning/triton-inference-server/user-guide/docs/tensorrtllm_backend/README.html) | 56, 81, 82, 85, 87, 88, 91, 95 |
| [NVIDIA guardrail models](https://docs.nvidia.com/nemo-platform/documentation/guardrail-models) | 97 |
| [OpenAI API: Prompt caching](https://developers.openai.com/api/docs/guides/prompt-caching) | 70, 94, 99 |
| [OpenTelemetry: Traces](https://opentelemetry.io/docs/concepts/signals/traces/) | 55, 94 |
| [PostgreSQL: Write-Ahead Logging](https://www.postgresql.org/docs/current/wal-intro.html) | 51, 57 |
| [Precise Zero-Shot Dense Retrieval without Relevance Labels](https://arxiv.org/abs/2212.10496) | 66, 74 |
| [Python documentation: tracemalloc](https://docs.python.org/3/library/tracemalloc.html) | 54 |
| [QLoRA: Efficient Finetuning of Quantized LLMs](https://arxiv.org/abs/2305.14314) | 90, 100 |
| [Redis: Semantic cache architecture](https://redis.io/docs/latest/develop/use-cases/semantic-cache/) | 61, 96 |
| [Self-RAG: Learning to retrieve, generate and critique](https://arxiv.org/abs/2310.11511) | 72 |
| [Sentence Transformers documentation](https://sbert.net/) | 73, 92, 96 |
| [Sentence Transformers hard-negative mining](https://www.sbert.net/docs/package_reference/util/hard_negatives.html) | 79 |
| [Sentence Transformers training overview](https://www.sbert.net/docs/sentence_transformer/training_overview.html) | 79 |
| [Sentence Transformers: Retrieve and re-rank](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html) | 62, 64, 65, 73, 75 |
| [WHATWG: Server-sent events](https://html.spec.whatwg.org/multipage/server-sent-events.html) | 86 |
| [vLLM parallelism and scaling](https://docs.vllm.ai/en/latest/serving/parallelism_scaling/) | 95 |
| [vLLM: Speculative decoding](https://docs.vllm.ai/en/latest/features/speculative_decoding/) | 83, 88 |
