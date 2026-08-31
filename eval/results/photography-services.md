# photography-services

Generated: 2026-08-31T14:55:20.246Z
Source file: photography-services.docx

## Seeded issues (answer key)

| Clause type | Severity | Description |
|---|---|---|
| payment_terms | medium | Payment window is net 90 with no late penalty, and Client may withhold payment entirely at its sole discretion. |

## Agent (Groq, playbook-grounded)

### Flagged (1)

| Clause type | Severity | Rule | Reason | Excerpt |
|---|---|---|---|---|
| payment_terms | medium | payment_terms.2 | The clause states 'Client may withhold payment... at its sole discretion', which directly matches risk pattern [2]. It also matches risk pattern [1] due to the 90-day term with no penalty, but pattern [2] is a more severe unilateral disadvantage explicitly cited in the text. | Client shall pay Photographer a total fee of $2,800, due within ninety (90) days of the event date. No interest or penalty shall accrue on late payment, and Client may withhold payment, in whole or in part, at its sole discretion if Client is not satisfied with the delivered images, without further obligation to Photographer. |

### Not flagged / uncovered (6)

| Clause type | Severity | Reason | Excerpt |
|---|---|---|---|
| other | low | Not a clause type covered by the playbook | This Photography Services Agreement is entered into as of June 12, 2026 by and between Willowmere Events Co. ("Client") and Theo Bracken, an independent contractor doing business as Theo Bracken Photography ("Photographer"). |
| other | low | Not a clause type covered by the playbook | Photographer shall provide photography coverage for Client's corporate event on June 28, 2026, and deliver an edited digital gallery of no fewer than 150 images within four (4) weeks of the event. |
| termination | medium | The clause defines automatic termination upon contract completion (delivery and payment), which is a standard mechanism for fixed-scope engagements. It does not restrict termination rights to one party arbitrarily (as the obligation to deliver/pay triggers it), nor does it involve termination for cause without cure, as this is not a cause-based termination clause. | This Agreement shall terminate automatically upon Photographer's delivery of the final image gallery and Client's payment in full. |
| ip_assignment | high | The clause grants a license rather than an assignment, but it limits usage to the delivered images (deliverables) and explicitly retains copyright with the creator, who may use them in their portfolio. This aligns with the standard principle of limiting IP rights to the specific engagement's outputs and preserves the contractor's rights to their own tools/portfolio, avoiding the listed risk patterns of over-assignment or lack of carve-outs. | Photographer grants Client a non-exclusive, perpetual license to use the delivered images for Client's business and marketing purposes. Photographer retains copyright in the images and may use them in Photographer's portfolio. |
| confidentiality | low | The clause imposes mutual confidentiality obligations ('Each party shall keep confidential...') and sets a reasonable duration ('two (2) years'), which aligns with the standard. While it lacks explicit carve-outs, it does not match the specific risk patterns of one-directional favor, indefinite duration, or unreasonably broad definition provided in the playbook. | Each party shall keep confidential any non-public information disclosed by the other party in connection with this engagement, for a period of two (2) years. |
| liability | high | The clause caps liability at the total fees paid and excludes indirect/consequential damages, which fully aligns with the standard pattern. It does not exhibit uncapped liability, include excluded damages, or create a one-way liability trap in a way that deviates from the standard protective measures described. | Photographer's total liability under this Agreement shall not exceed the total fees paid, and Photographer shall not be liable for indirect or consequential damages. |

## Baseline (Ollama, naive prompt)

- The agreement does not specify what constitutes 'satisfaction' for the Client to withhold payment.
- The agreement does not specify what 'non-public information' is subject to confidentiality.
- The agreement does not specify how the Photographer will deliver the final image gallery, making it unclear when the agreement will terminate.
- The agreement does not specify the format or medium of the delivered images, which may be unclear for both parties.
- The agreement does not specify any consequences for the Client's withholding of payment beyond the Photographer's release from further obligation.
- The agreement does not specify the Photographer's liability in the event of damage or loss of Client's property during the event.
- The agreement does not specify any obligations or responsibilities of the Client beyond payment and confidentiality.
