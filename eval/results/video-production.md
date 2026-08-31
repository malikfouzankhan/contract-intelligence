# video-production

Generated: 2026-08-31T14:59:05.568Z
Source file: video-production.docx

## Seeded issues (answer key)

| Clause type | Severity | Description |
|---|---|---|
| liability | high | Liability appears capped at fees paid, but the carve-out exceptions (confidentiality, indemnification, data handling, third-party content, and any dispute over whether work met expectations) are broad enough to swallow the cap in practice, leaving liability effectively unlimited for most realistic disputes. |

Notes: The cap looks standard on first read ('shall not exceed the total fees paid'), but the exceptions clause is broad enough to cover nearly any real dispute, especially the catch-all for work not meeting Client's expectations. Tests whether verification catches a cap that is illusory due to its own exceptions, not just the presence or absence of a cap.

## Agent (Groq, playbook-grounded)

### Flagged (1)

| Clause type | Severity | Rule | Reason | Excerpt |
|---|---|---|---|---|
| liability | high | liability.0 | While there is a general cap, the clause explicitly states 'unlimited liability' for several categories including confidentiality, indemnification, and work quality, matching the risk pattern of uncapped or unlimited liability in specific critical areas. | Producer's liability for direct damages arising under this Agreement shall not exceed the total fees paid by Client. This limitation shall not apply to, and Producer shall bear unlimited liability for, any claim relating in any way to Producer's confidentiality obligations, indemnification obligations, data handling, use of third-party footage or music, or any claim where Client alleges the delivered work did not meet Client's expectations. |

### Not flagged / uncovered (6)

| Clause type | Severity | Reason | Excerpt |
|---|---|---|---|
| other | low | Not a clause type covered by the playbook | This Video Production Services Agreement is entered into as of March 20, 2026 by and between Aurelia Wellness Brands ("Client") and Kai Renwick, an independent contractor doing business as Kai Renwick Films ("Producer"). |
| other | low | Not a clause type covered by the playbook | Producer shall produce and deliver three (3) promotional video assets for Client's product launch campaign, as described in Exhibit A. |
| payment_terms | medium | The clause specifies a clear payment schedule (50% on signing, 50% within 30 days of delivery), which aligns with the standard for a clear timeline and net 30 or shorter terms. It does not exhibit vague timelines, extended terms without penalties, or discretionary withholding rights. | Client shall pay Producer a total fee of $9,000, with 50% due upon signing and 50% due within thirty (30) days of final delivery. |
| termination | medium | The clause allows either party to terminate and specifies a 30-day written notice, which aligns with the standard pattern of reasonable notice and mutual termination rights. | This Agreement shall terminate upon delivery and acceptance of the final video assets, unless terminated earlier. Either party may terminate this Agreement upon thirty (30) days' written notice. |
| ip_assignment | high | The assignment is limited to 'final delivered video assets' and explicitly retains ownership of raw footage and materials for the Producer, adhering to the standard of limiting assignment to deliverables and including a carve-out for underlying materials. | Upon full payment, Producer assigns to Client all rights in the final delivered video assets. Producer retains ownership of raw footage and production materials not included in the final deliverables. |
| confidentiality | low | The clause establishes mutual confidentiality obligations ('Each party') with a reasonable duration ('two (2) years'), which matches the standard playbook. It does not display one-directional obligations, indefinite duration, or an unreasonably broad definition that would trigger the listed risk patterns. | Each party shall keep confidential any non-public information disclosed in connection with this engagement, for a period of two (2) years following disclosure. |

## Baseline (Ollama, naive prompt)

- The contract does not specify what happens if the Producer fails to deliver the final video assets within the agreed timeframe.
- The contract does not clarify what is considered 'raw footage and production materials not included in the final deliverables', which could lead to disputes over ownership and use.
- The limitation of liability clause appears to be inconsistent, as it states that the Producer's liability for direct damages does not exceed the total fees paid, but then states that the Producer bears unlimited liability for certain specific claims.
- The contract does not specify what constitutes 'non-public information' for the purposes of the confidentiality clause, which could lead to disputes over what is considered confidential.
- The contract does not specify what happens if the Client terminates the agreement early, and whether the Producer is entitled to any payment or compensation in such a case.
