# Industry and advanced architecture research map

The 28 industry blueprints and advanced modules 101–112 are illustrative designs, not claims about named-company deployments. Industry workflows, failure cases, controls, and metrics are original architectural examples. References support underlying protocol, reliability, provenance, isolation, and risk-management principles; they do not certify compliance or validate an industry deployment. Primary sources below were opened and checked on 18 September 2026.

## Identity, privacy, and bounded authority

- [NIST SP 800-207: Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final): supports explicit identity and resource authorization boundaries. Applied to scoped evidence retrieval, tool enforcement, and delegated actions.
- [IETF RFC 8693: OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693): supports token-exchange and delegation terminology. Business action authorization remains an application responsibility.
- [Kubernetes multi-tenancy](https://kubernetes.io/docs/concepts/security/multi-tenancy/): supports shared-platform isolation considerations. Applied to tenant stores, workload placement, resource fairness, and operator boundaries.
- [NIST Privacy Framework](https://www.nist.gov/privacy-framework): informs explicit information lifecycle and privacy-risk ownership. The proposed memory propagation and suppression mechanisms are design choices, not prescribed legal requirements.
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework): provides a general risk-management reference for accountable evaluation and oversight. No blueprint claims certification or automatic compliance.

## Durable coordination and inspectable history

- [Temporal workflow execution](https://docs.temporal.io/workflow-execution) and [workflow definitions](https://docs.temporal.io/workflow-definition): support durable coordination and deterministic replay distinctions. External effects still require idempotency or reconciliation.
- [CloudEvents](https://cloudevents.io/): supports interoperable event envelopes. Domain event meaning, event ordering, duplicates, and access policy remain architecture responsibilities.
- [Microsoft Event Sourcing pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/event-sourcing): supports event history, projections, and reconstruction tradeoffs. The examples keep projection replay separate from external effect execution.
- [OpenTelemetry traces](https://opentelemetry.io/docs/concepts/signals/traces/): supports observable request and workflow correlation. The proposed metrics measure preparation, effects, evidence, and unresolved work without collecting private model reasoning.

## Industry integration boundaries

- [HL7 FHIR R5 security considerations](https://www.hl7.org/fhir/security.html): supports the distinction between healthcare exchange formats and the surrounding authentication, authorization, audit, provenance, and privacy controls. Used for healthcare retrieval; clinical and trial decisions remain qualified-human responsibilities.
- [OPC Foundation Unified Architecture](https://opcfoundation.org/about/opc-technologies/opc-ua/): supports industrial information integration. Physical-control separation is a deliberate safety boundary in these examples; the source does not endorse the agent blueprints.

## Agent interoperability and runtime constraints

- [MCP specification, 2025-11-25](https://modelcontextprotocol.io/specification/2025-11-25) and [authorization](https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization): support the host/client/server and capability integration model. The lesson names the reviewed version and does not assume protocol interoperability confers trust.
- [Kubernetes Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/): supports concrete runtime privilege restrictions. Stronger isolation may be necessary for hostile generated code; containers are not presented as universally sufficient.
- [Kubernetes Resource Quotas](https://kubernetes.io/docs/concepts/policy/resource-quotas/): supports platform resource constraints. Task-level token, tool, and monetary reservations are additional application mechanisms.

## Provenance and dependency integrity

- [W3C PROV overview](https://www.w3.org/TR/prov-overview/): supports source and derivation relationships. Applied to multimodal evidence anchors and correction or deletion propagation through derived artifacts.
- [SLSA specification 1.2](https://slsa.dev/spec/v1.2/) and [provenance](https://slsa.dev/spec/v1.2/provenance): support artifact origin and build provenance. Signatures and attestations establish identity and history, not behavior correctness or unrestricted runtime authority.

## Editorial conventions

Every industry includes four scoped specialists, six runtime steps, two domain-specific diagrams, two failures with detection and recovery, five controls, four defined metrics, three tradeoffs, and three rollout acceptance gates. Related-topic identifiers point to the canonical 1–100 collection. Outcomes are evaluation hypotheses, not fabricated performance claims.

Advanced modules are separate additions in category 5 and preserve the canonical numbering and titles. They cover interfaces, evaluation, durability, isolation, delegation, event history, residency, multimodal evidence, budgets, memory lifecycle, human handoffs, and dependency integrity. Each includes a concrete illustrative case, production progression, failure handling, use and non-use guidance, and a seven-item checklist.
