# M.A.P.S Cognitive Framework: Theoretical & Scientific Foundations

The M.A.P.S UI/UX framework is grounded in cognitive psychology, human-computer interaction (HCI), and neuro-design principles.

---

## 1. Minimal (精簡) — Cognitive Load Theory & Capacity Limits

### Theoretical Foundations
* **Sweller’s Cognitive Load Theory**: Working memory capacity is strictly limited. Cognitive load consists of:
  1. *Intrinsic load*: The inherent difficulty of the task.
  2. *Extraneous load*: Wasteful mental effort imposed by poor UI layout, confusing icons, or unnecessary elements.
  3. *Germane load*: Effort dedicated to processing and building mental schemas.
  * *Goal*: Minimize extraneous load so the user can allocate cognitive bandwidth to their primary goal.
* **Miller’s Law ($7 \pm 2$) & Cowan's Working Memory Limit (4 Items)**: Humans can only hold 4–7 discrete chunks of information in active working memory at once.
* **Hick’s Law ($T = b \cdot \log_2(n + 1)$)**: The time it takes to make a decision increases logarithmically with the number and complexity of choices.

### UI/UX Translation
* Remove non-essential decoration (heavy drop shadows, multiple nested borders, redundant labels).
* Never display more than 5–7 primary choices in a single navigation level or toolbar.
* Adopt the **"1 Viewport, 1 Primary Action"** principle: secondary actions are visually demoted to outline/ghost styles.

---

## 2. Applicable (具體化) — Mental Models & Grounded Cognition

### Theoretical Foundations
* **Grounded / Embodied Cognition**: The human brain processes concrete, sensorimotor concepts far faster than abstract mathematical or symbolic representations.
* **Norman’s Mental Models & Gulf of Execution**: Users carry existing mental models of how physical systems work. If UI controls fail to provide clear *affordances* and *signifiers*, the "Gulf of Execution" widens.
* **Dual-Coding Theory (Paivio)**: Information processed through both visual and verbal channels simultaneously creates stronger, faster comprehension.

### UI/UX Translation
* **Live Previews**: Instead of selecting `border-radius: 12px` or choosing from abstract dropdowns, show an interactive mini-card preview.
* **Concrete Human Microcopy**: Replace systemic failure codes with user-centric explanations and immediate recovery steps.
* **Visual Affordances**: Buttons should exhibit tactile elevation and click states; drag handles must show grip indicators (`⋮⋮`).
* **Rich Empty States**: Provide pre-populated sample templates rather than an intimidating empty white canvas.

---

## 3. Patterns (分類/模式) — Gestalt Psychology & Pattern Recognition

### Theoretical Foundations
* **Gestalt Laws of Visual Perception**:
  * *Law of Proximity*: Objects placed close together are perceived as belonging to the same group.
  * *Law of Similarity*: Elements sharing color, shape, or typography are perceived as having the same functional meaning.
  * *Law of Common Region*: Enclosing elements within a visual boundary (card/box) creates instant grouped meaning.
  * *Law of Focal Point*: An element with distinct contrast captures attention first.
* **Jakob’s Law of Internet User Experience**: Users spend most of their time on other apps. They expect your interface to work identically to standard conventions they already know.

### UI/UX Translation
* **Cardification & Chunking**: Group related information into distinct cards with clear container boundaries.
* **Semantic Color Token System**:
  * Red = Destructive, Error, Urgent.
  * Amber = Warning, In-progress, Caution.
  * Green = Success, Validated, Operational.
  * Brand/Blue = Interactive, Primary CTA, Navigation.
* **Predictable Layout Grids**: Utilize 8pt grid spacing and consistent visual landmarks (sticky header, left sidebar navigation).

---

## 4. Step by Step (由簡入繁) — Progressive Disclosure & Flow Theory

### Theoretical Foundations
* **Progressive Disclosure (Nielsen)**: Separating advanced from core features prevents novice users from feeling overwhelmed while keeping advanced functionality accessible to power users.
* **Csíkszentmihályi’s Flow State & Goal Gradient Effect**: Motivation and engagement surge as users perceive tangible forward progress toward a clearly delineated milestone.
* **Cognitive Pacing & Scaffolding (Vygotsky's ZPD)**: Users learn complex interfaces best when guided through incremental steps rather than presented with full complexity up-front.

### UI/UX Translation
* **Multi-Step Form Wizards**: Split 15-field forms into 3-4 logical, bite-sized steps with a visual progress tracker.
* **Layered Controls ("Advanced Settings ▾")**: Keep 80% default use cases immediately visible; tuck 20% complex parameters behind expandable accordions.
* **Progressive Onboarding**: Deliver context-sensitive micro-tutorials when the user first reaches a feature, rather than presenting a lengthy onboarding modal on initial login.
