# Kirby Risk Internship — Final Presentation Outline

**Target:** 15 minutes · 15 slides · ~13:40 of content (80 sec of slack — you will need it)
**Audience:** mixed, mostly non-technical. Every slide has to land for someone who doesn't know what PowerShell is.

**Thesis — say it on slide 3, collect on it in every status line:**
> *Everything I built runs without me.*

**Legend**
- 🔒 verified against your actual work — safe to present
- ⚠️ **CONFIRM** — check before saying it out loud
- ⭐ highest-value line on the slide — never cut
- 💬 Q&A backup only — do not put on a slide

---

## Timing budget

| # | Slide | Sec | Cuttable? |
|---|---|---|---|
| 1 | Title | 20 | trim to 15 |
| 2 | The Environment | 40 | — |
| 3 | Roadmap | 15 | no |
| 4 | The Body of Work — X scripts | 45 | no — it reframes everything after |
| 5 | .NET — The Build | 80 | **never** |
| 6 | .NET — Impact, and What Broke | 75 | **never** |
| 7 | AppX — The Capability Gap | 65 | **never** |
| 8 | AppX — The Hard Part + Status | 75 | drop the optional beat |
| 9 | Device Onboarding Site | 65 | no |
| 10 | The Pipeline — What I Built | 75 | **never** |
| 11 | Deploy, Release, Enforce | 60 | trim to 45 |
| 12 | Making It Scale | 45 | first thing to cut |
| 13 | Governing AI Development | 85 | **never** — most current work |
| 14 | What I Learned | 40 | trim to 30 |
| 15 | Close | 35 | trim to 25 |
| | **Total** | **820** (13:40) | |

**Cut order if you run long:** slide 12 → slide 14 → slide 8's optional beat → slide 1 → slide 11's third beat.
**Never cut:** 4, 5, 6, 7, 10, 13.

---

## 1. Title — 20 sec

**On slide:** Name · Systems & Automation Intern · Kirby Risk · dates · total hours

**Say:** Your name, the role, done. Do not editorialize on the title slide.

---

## 2. The Environment — 40 sec

**On slide:**
- Kirby Risk — electrical distributor, multi-site
- **1,600+ company computers**
- Two tools: one finds problems, one reaches every machine

**Say:**

1. Scale first, out loud, slowly:
   > *"Kirby Risk runs about **1,600 Windows computers** across multiple sites."*

   This number is what makes every later slide land.

2. Gloss both tools once and never explain them again:
   > *"Tenable scans every machine and tells us what's out of date or vulnerable. NinjaOne is how we reach all 1,600 machines to actually fix it."*

3. Where the work came from:
   > *"The scanner tells you something's broken on hundreds of machines. Then somebody fixes them one at a time, by hand. That gap is what I spent the internship closing."*

🔒 All accurate.

---

## 3. Roadmap — 15 sec

**On slide:** Three areas — **Endpoint automation** · **Internal tools** · **Developer platform** — and one line: *Everything I built runs without me.*

**Say:** Name the three areas. Say the thesis once. Move on. Fifteen seconds. It buys audience patience and gives them a frame to hang everything on.

---

## 4. The Body of Work — 45 sec

**On slide:** the number **X** in large type, and every script name laid out as a grid underneath, grouped into four buckets. No descriptions — the names are the visual.

**Say — do not read the names out loud. Let the slide do that.**

> *"Over the internship I wrote **X** automation scripts and tools. They fall into a few buckets: fixing security findings across the fleet, managing the lifecycle of a machine from setup through decommission, troubleshooting Windows-level security problems, and automating processes that were being done by hand."*

Then the pivot — **this is the whole point of the slide:** ⭐
> *"Most of these are small and specific. Two of them grew big enough to be their own projects, and those are the two I want to walk through."*

**Why this slide earns 45 seconds:** without it the deck sounds like you did two things all summer. With it, the two deep dives read as the largest of many — which is both true and far more impressive. It also pre-empts the unasked question *"so what else did you actually do?"*

**Building it:**
- ⚠️ Get the exact count. Include the two big ones — say *"X scripts and tools, two of which grew into full projects."*
- Group by the four buckets, not alphabetically. Category structure reads as engineering judgment; a flat list reads as a pile.
- If a name is cryptic internal jargon, rename it for the slide or leave it out. A room that can't parse a name gets nothing from seeing it.
- 🔒 The four buckets come from your own work history: vulnerability remediation (ACLs, registry keys, executable permissions), endpoint lifecycle management, OS-level Windows security troubleshooting, and process automation.

---

## 5. .NET Remediation Framework — The Build — 80 sec

**On slide:** Problem statement + pipeline diagram: *find everything → decide what's wrong → install → remove → verify → report*

**Problem, one sentence:**
> *".NET is a Microsoft component most business software depends on. Old versions have security holes. Ours were outdated across the fleet, flagged over and over, and fixed by hand every time."*

**Walk the pipeline in one pass.** Don't stop on any box.

**Then three points, in this order:**

### ① It finds versions in five different places 🔒
> *"Software doesn't record itself in one place. .NET leaves traces in five different spots on a machine, and the security scanner was reading one my tool wasn't — so it kept flagging a version my tool couldn't even see. I went and learned how the scanner actually looks, and taught mine to look there too."*

- Say **five**. The specific number is the credibility.
- 💬 Technical answer: the fifth was SWID tags — ISO 19770-2 metadata files under `C:\Program Files\dotnet\swidtag\`. No uninstall entry, so nothing else would ever have removed them; needed a dedicated cleanup path. The other four: dotnet CLI, filesystem, setup registry, uninstall registry.

### ② It asks Microsoft what "current" means 🔒 ⭐
> *"Every run, it asks Microsoft directly what the newest version is, downloads it, checks the file is authentic, and installs it. Which is why nobody has to update the tool when Microsoft ships a new release — it already knows."*

- Strongest thesis-payoff line on the slide, and the setup for slide 6's impact claim. Do not cut it.
- Same idea for the rules:
  > *"And what counts as 'too old' is a setting, not something buried in the code. I set a minimum acceptable version for each product line — anything below it is a finding, and the lines Microsoft no longer supports are rejected outright."*

### ③ The safety rule 🔒
> *"It never removes an old version until it has confirmed a newer one is installed and working. And every destructive action defaults to a dry run — it shows you what it would do before it's allowed to do anything."*

**Language:** say **"framework," not "script."** It takes inventory, makes decisions, verifies its own work, and reports.

---

## 6. .NET — Impact, and What Broke — 75 sec

**Impact leads. Dell is a supporting beat, not the centerpiece.**

**On slide:** the before/after finding count, and the status line

### Beat 1 — What it did (≈35 sec) ⚠️ **CONFIRM the numbers from Tenable**

> *"Before this existed, .NET findings were our most repetitive vulnerability — flagged every scan, fixed by hand every time, and back again the next quarter when Microsoft shipped a new version."*
>
> *"It cleared every .NET finding we had. And it keeps them cleared — because it isn't checking against a version I typed into it last spring, it's checking against whatever Microsoft published this morning. When the next update comes out, the fleet is current within a day and nobody files a ticket."*

**Then the line to land it on:** ⭐
> *"It didn't just clear the findings. It closed the category. This isn't a vulnerability that comes back."*

- Use **"closed the category,"** not "cleared all past and future vulnerabilities." The literal version invites a technical person to point out that a brand-new .NET CVE could always appear. "Closed the category" is accurate, memorable, and can't be picked apart — and it's the stronger claim anyway.
- ⚠️ Fill in real numbers: *"Took it from X findings to zero, and it holds that line daily."*

### Beat 2 — Dell, compressed (≈25 sec) 🔒

Keep it. It's what makes the impact claim credible rather than a brochure line, and slide 14's first lesson points at it.

> *"It didn't go smoothly. Dell ships management software that runs constantly on all 1,600 machines, and it had a lock on the exact files my cleanup was trying to delete. My cleanup removed the parts it could reach and left the parts it couldn't — which wouldn't crash anything that day, but would surface later as a failure on however many machines I'd already touched."*
>
> *"So I rebuilt removal to be all-or-nothing: check the whole folder first, and if anything is in use, don't delete a single file. Mark the machine 'finish after reboot' and move on."*
>
> *"At one machine, that's a bug. At 1,600, that's an outage. That's the difference I didn't understand before this internship."*

Land the last line, then stop. Do not continue into the error-handling detail.

### Beat 3 — one sentence (≈15 sec) 🔒 — cut this first if you're over
> *"And I almost missed it, because my own error handling was swallowing the reason. The run just said 'failed.' I fixed the logging first, and the real error was sitting right there."*

**Status line:** *In production. Runs daily across 1,600+ computers, cleared our .NET findings, and handles every future release on its own.*
→ then say: **"and this runs without me."**

💬 **Full Dell version — your answer to "what happens when it fails on a machine?"** The processes holding the lock were Dell's TechHub stack (`Dell.CoreServices.Client`, `Dell.TechHub`, plus Analytics / DataManager / Diagnostics / Instrumentation sub-agents). Framework-dependent services that auto-start at boot and bind to the runtime present at *their* launch. Core assemblies are memory-mapped so they survive deletion; anything not yet lazily loaded was gone, surfacing later as a `FileNotFoundException`. Fix: lock pre-flight across every file, a `Deferred` status rather than `Failed`, and a reboot-required signal back to NinjaOne so a clean defer stops showing red.

💬 **"Why not just close the Dell software first?"** Managed services that respawn, and hard-killing a vendor's telemetry agents mid-run buys nothing but noise. On reboot they roll forward to the new runtime and release the folder.

💬 **The network-drop proof** — on one run the network dropped mid-way; half the new versions installed, half didn't, and the tool refused to delete the old versions that hadn't been replaced. Machine kept working, next run finished the job. Best available answer to *"how do you know it's safe."*

💬 **The silent no-op** — for a while it reported a clean run and removed nothing: searching for a folder by one name while the folder on disk was named slightly differently. *"A tool that fails loudly is fine. A tool that quietly does nothing and reports success is worse than no tool."*

💬 **The deadlock your own safety rule created** ⚠️ **CONFIRM whether you shipped the reordering or only diagnosed it** — some machines had a piece of .NET already broken, which broke Microsoft's own installers, so nothing new could install; and the safety rule meant your tool wouldn't clear the broken piece either. Needs 35 seconds to land, so Q&A only.

---

## 7. AppX / MSIX Automation — The Capability Gap — 65 sec

**On slide:** *"The Microsoft Store is blocked. There was no way to install or update Windows apps across the fleet."*

**Say — this exact framing, don't soften it:** 🔒 ⭐
> *"The Store is blocked for security reasons, so there was no mechanism to install or update Windows apps across the fleet. I built the way. The team uses it now."*

- The strongest sentence in the deck. No qualifiers stacked on it. Say it, pause, then explain.

**Then, plainly:**
> *"Rather than work around the Store, I went to the place Microsoft actually keeps the apps and pulled them directly — then installed them the way Windows installs them underneath the Store."*

**Frame impact, not size:**
> *"Before this, the company had no way to do this at all. This is the only mechanism that exists for it."*

- Skip line counts. "600–700 lines" means nothing to this room; "the only mechanism that exists" means everything.

💬 **Q&A:** fetches packages from the Windows Update SOAP API and provisions them with DISM. Some apps ship as empty `1.0.0.0` placeholder packages that must be explicitly told to pull the real payload — a flag on the provisioning call, and missing it gets you a stub that looks installed and isn't.

---

## 8. AppX — The Hard Part, and Status — 75 sec

**On slide:** *The hard part wasn't the apps. It was the people using them.*

### The setup (≈20 sec) 🔒
- *"Installing software on a computer someone is actively working on is a completely different problem from installing it on an empty one."*
- *"If they're logged in, you can't just close their apps mid-task. The tool notices someone's working, asks them, and lets them postpone — with a limit, so it can't be put off forever."*
- *"If they're not logged in, it stages the work so it finishes cleanly the next time they sign in."*

💬 The limit is a 48-hour grace window tracked on the machine itself, so a reboot doesn't reset it.

### The story beat (≈40 sec) 🔒 ⭐

> *"My first version had the order wrong in a way that mattered. It removed the logged-in person's copy of the app inside the main loop — before the warning ever reached them. They got interrupted first and asked second."*
>
> *"But when I went to fix the warning timing, I found the real answer: that removal step didn't need to happen at all. You can install the new version right over the old registration. The app the person has open keeps running off the files it already has until they next open it — while the record the security scanner reads updates immediately. Both things are true at once."*
>
> *"So the fix wasn't a better warning. It was deleting a step. I restructured the whole thing into four phases where nothing the user can see happens until after they've been asked."*

- **"The fix was deleting a step, not adding one"** is the most quotable sentence in the deck. A non-technical audience will repeat it.
- Four phases on the slide as four words: **stage → ask → clean up → switch over.**

### The optional beat (≈15 sec — first thing to cut) ⚠️ **CONFIRM the reuse count**
> *"A separate bug had the tool checking its own settings instead of the logged-in person's — because it runs as the computer, not as a person. So audits were quietly passing when they should have failed. I fixed it and reused the same fix in two more tools."*

- Confirm it was two before saying "two." If unsure: *"and reused the same fix elsewhere."*

**Status line:** *In use across the team today, for both installing and updating Windows apps.*

💬 **Q&A:** removing a package for all users at once tears out the system-level provisioning anchor and cascades; per-user cleanup must be scoped to individual accounts. Running as the machine account there is no "current user," so every such lookup needs a null guard. A machine with an orphaned provisioning record from an older imaging problem refuses the install with a misleading error until the stale record is cleared.

💬 **What it's been used for:** Microsoft deprecated 3D Viewer in February 2026 and pulled it from the Store in July. The correct remediation wasn't updating it — it was removing it from all 1,600 machines. Same tool, opposite direction.

---

## 9. Device Onboarding Site — 65 sec

**On slide:** a screenshot of the site — before and after, side by side if you still have the old version. This is the only slide with something visual to *show*, so give it real space.

### What it is and that you built all of it (≈30 sec) 🔒
> *"New hires used to get their computers set up by following someone else's instructions — a document, or a person walking them through it. I built a site that walks them through it themselves."*
>
> *"I designed it and wrote all of it — the layout, the styling, the behavior. HTML, CSS, and JavaScript. It's structured so every step is a single action, and it tracks your progress as you move through it, so you can stop, come back, and know exactly where you left off."*

- ⚠️ **CONFIRM the no-frameworks framing.** If vanilla was a deliberate choice, say why — it's defensible and it's your thesis applied to a front end:
  > *"No frameworks, deliberately — nothing to install, nothing to update, nothing that breaks when I'm gone."*

  If you'd just build it differently now, skip that line entirely.

### The rebuild (≈30 sec) 🔒
> *"Partway through, the head developer told me the quality wasn't there. I rebuilt it from scratch, properly."*
>
> *"The second version was better because I'd stopped designing it for me and started designing it for someone on their first day who doesn't know what any of it is called yet."*

- Say it straight: got critical feedback, took ownership, rebuilt it. Not "received some suggestions."
- **Say what the rebuild taught you, not how the feedback felt.** The lesson is the point; the sting isn't.

**Status line:** *Live. Used to onboard every intern this cycle.*

**Why this beat outperforms a flawless highlight reel:** every intern in that room will claim they take feedback well. You have a rebuilt artifact and a specific thing you understood afterward that you didn't before. Don't shorten it to save time.

💬 **If asked what you'd do differently:** you now know the tooling side — you'd put it in the pipeline so its build and deploy are as hands-off as everything else. Good answer, because it connects slide 9 to slide 10 rather than leaving them as separate lives.

---

## Transition into the platform arc — 5 sec, say it out loud

> *"That's the endpoint and internal tools side. The last part is the other end entirely — the process the code itself goes through before it becomes software anyone uses."*

Without this sentence the deck feels like two unrelated presentations stapled together.

---

## 10. The Pipeline — What I Built — 75 sec

**On slide, as two columns:**

| Before | Now |
|---|---|
| Developer changes code | Change gets checked automatically |
| Someone eyeballs it | Can't merge until it passes |
| Someone copies files onto the server | It deploys itself |

**Say — lead with "built," not "own":** 🔒
> *"KRSpark is the internal web application our team is building. When I got there it had no automated checking of any kind. I built the pipeline that does it — from nothing, having never touched CI/CD before."*

**Then walk what it checks, and count them out loud:** 🔒
> *"Every change now gets checked seven ways before anyone can merge it: does the code compile, does it build, are any of our third-party dependencies known to be vulnerable, is it written to our standards, is it formatted consistently, does it pass a security-specific review, and finally one gate that has to see all of those pass."*

- ⚠️ **CONFIRM the count** against your current `ci.yaml`. Jobs I know about: type-check, build, dependency audit, lint, format, security lint, pass-gate. If a test job is in there now, say **eight**.

**Then the story beat — this carries the slide:** ⚠️ **CONFIRM how you resolved it** ⭐
> *"And it caught a real one. The security check flagged a piece of our own code that loaded files based on a value it hadn't verified — the kind of thing that lets someone load something you didn't intend. It got caught before it merged, not after it shipped."*

- This is `pluginLoader.ts` and the dynamic `import()` the `no-unsanitized` rule flagged. Confirm whether you restructured it (`import.meta.glob`) or documented the justification because the path comes from a trusted internal registry. Both are professional — say the true one.

**Then the tests beat (≈15 sec):** 🔒
> *"The pipeline could tell you the code compiled. It couldn't tell you the code was right. So I added the first automated tests the project ever had — starting with the access-control logic, the part that decides what a given user is allowed to see."*

**Status line:** *In production. Every change to KRSpark runs through it, and nothing merges until it passes.*

💬 **Q&A:** self-hosted Windows runner, Gitea Actions, PowerShell throughout, pnpm resolved via Corepack from `packageManager`, `--frozen-lockfile` for reproducible installs, Node version read from `engines` rather than hardcoded.

---

## 11. Deploy, Release, Enforce — 60 sec

**On slide:** three words — **Deploys itself · Every version labeled · Checks are load-bearing**

### ① It deploys itself (≈22 sec) 🔒 ⭐
> *"Getting code onto the production server used to be a person copying files onto it. Now the pipeline does it: builds the application, verifies the build actually produced something, copies it to the live server, and fails loudly if it doesn't land. I built that for the front end, and a second one for the .NET back-end service."*

- The most legible sentence in this arc for a non-technical room: *someone used to copy files onto a server by hand; now nobody does.*

### ② Every version is labeled (≈18 sec) ⚠️ **CONFIRM the rollback claim**
> *"Every release gets a version number and an automatic record of what changed in it. Test versions are recognized as test versions without anyone flagging them by hand."*

- Pre-release auto-detection from the tag name is real and shipped. 🔒
- ⚠️ Only add *"and we can put a previous version back on demand"* if the `ref` input is actually wired into the deploy checkout. If not, leave it out — don't hedge it.

### ③ The checks are load-bearing (≈20 sec) ⚠️ **CONFIRM branch protection is configured**
> *"A check that just reports a problem is a suggestion. I set it up so the checks actually block — you cannot merge code that fails them. And I structured who on the team can change what, so the pipeline itself can't be quietly edited around."*

- ⚠️ If branch protection isn't configured yet, say it as design intent: *"the next step is making them blocking rather than advisory — a settings change, not a code change."* Being straight is stronger than being caught.

**Status line:** *Every deploy to the live server runs through it — untouched by hand.*

---

## 12. Making It Scale — 45 sec

**On slide:** *Built once. Inherited by everything after.*

**Say:** 🔒
> *"The last piece was making sure none of this was a one-project thing."*
>
> *"The checks themselves now live in one central repository. Projects reference them instead of copying them — so when I improve one, everything improves. There's no version of this where five teams have five slightly different, slowly rotting copies."*
>
> *"And I built a starter template so a new project begins with all of it already wired up on day one — the pipeline, the standards, the tooling, the tests. There's a second one in progress for the .NET side, and a third stack after that."*

- ⚠️ **CONFIRM before saying "projects reference them":** is KRSpark's CI actually calling the shared workflows yet, or is the central repo built but not yet consumed? If built-but-not-consumed: *"the checks now live in one central place so projects can inherit them instead of copying them"* — same substance, no overclaim.
- 🔒 Real: the central `Pipelines` repo with reusable workflows, `VUE-APP-TEMPLATE` complete, `NET-APP-TEMPLATE` in progress.

**Do not put on the slide:** the RA Serialization pipelines (written, not merged — mention only if asked), Gitleaks (still pending the IT binary install — **do not claim it's running**), reusable-workflow path constraints, the TypeScript version pin.

---

## 13. Governing AI Development — 85 sec

**On slide:** four stacked bands, softest at the top and hardest at the bottom:
**Rules** (what it should do) → **Procedures** (how it does the repeatable work) → **Reviewers** (read-only, look but don't touch) → **Enforcement** (hard blocks)
One line underneath: *Rules for the 99%. Hard blocks for the things that must never happen.*

**Open with the problem, not the technology.** This room does not need to know what an agent is; it needs to know why this matters.

> *"People on our team write code with AI now — and some of the people doing it aren't developers. That's happening whether or not anyone's governing it. So the question isn't whether to allow it. It's whether it happens inside guardrails or without them."*

### The four layers (≈45 sec) 🔒 — this is the slide

> *"So I built four layers."*
>
> *"**First, a rulebook** the AI reads before it touches anything — here's the stack, here are the commands, here's what you don't touch. Written to be portable, so it works with whatever AI tool someone happens to be using rather than locking us to one vendor."*
>
> *"**Second, a set of written procedures** for the repeatable work — done the same way every time instead of improvised. Running the checks and explaining in plain language what failed and how to fix it. Writing tests. Keeping documentation current. Checking accessibility."*
>
> *"**Third, reviewers** with read-only access — they can look, they can't change anything. One reviews the architecture: is this design trusting something it shouldn't. One reviews the code itself. They're separate rather than one reviewer doing both, because they're looking at different altitudes — 'is this line correct' and 'is this design sound' are different questions, and one reviewer hunting for everything does none of it well."*
>
> *"**Fourth, the enforcement layer** — hard blocks on the handful of actions that must never happen. Not a warning. It doesn't execute. Regardless of what the AI decided, and regardless of whether whoever's driving it read the rules."*

### The point of all of it (≈20 sec) ⭐
> *"None of this replaces the people doing reviews. Accessibility is the clearest example — that was already being reviewed, and it still is. What changed is that it's now also checked on every single change, automatically, before a person ever opens it. The human review gets to start from a cleaner place and spend its attention on the things a checker can't see."*

- **This is the framing that makes the slide land with managers**: you didn't replace anyone's judgment, you removed the mechanical part of their work so their judgment goes further. Say it in those terms.
- ⚠️ Do **not** say nobody was checking accessibility before. People were. "Now it's consistent and automatic" is the true claim and the stronger one.

### The close — the callback ⭐
> *"Which is the same lesson as the pipeline, one layer up. Written guidance is a suggestion. Enforcement is a rule. I ended up building both, twice, for two completely different problems."*

**Notes on building this slide:**
- **Language for this room:** say **"rulebook," "procedures," "reviewers," "enforcement layer."** Do **not** say AGENTS.md, skill, PreToolUse hook, subagent, or agent. The concepts land; the nouns don't.
- 🔒 All real: `AGENTS.md` as the portable rulebook with `CLAUDE.md` as a thin adapter; skills covering CI checks, test writing, documentation, and accessibility; the architecture and code-review subagents restricted to read-only tools; PreToolUse hooks blocking the wrong package manager and protecting the lockfile and workflow files.
- ⚠️ **A count would strengthen this slide the way it strengthens 4, 5, and 10.** Something like *"four layers, six procedures, two reviewers"* — get the real numbers before you commit to phrasing.
- ⚠️ **CONFIRM adoption before implying it.** If teammates are using it: *"it's in the template every new project starts from."* If built and not yet rolled out: *"built and going into the templates"* — and don't imply usage.

💬 **Q&A — the mechanism:** `AGENTS.md` at the repo root is a vendor-neutral rulebook any AI coding tool can read; `CLAUDE.md` is a one-line adapter pointing at it, so switching vendors doesn't mean rewriting the rules. Skills are markdown procedures loaded on demand rather than dumped into every conversation. Hooks are PowerShell scripts on a PreToolUse trigger — the script inspects the intended action and returns a non-zero exit to veto it. The reviewers are subagents: fresh context window, tools restricted to read, grep, and glob.

💬 **"Why separate reviewers instead of one?"** Different altitudes, and isolation. Each starts with a clean context so it isn't primed by everything else in the conversation, and restricted tools mean a reviewer structurally cannot modify what it's reviewing.

💬 **"What's next with it?"** Running it headlessly inside the pipeline: when a check fails, the explanation of *why* is already posted on the pull request before the developer looks. The fully automatic version of the same idea.

💬 **"Isn't this just trusting AI with your codebase?"** The opposite, and worth saying clearly: the design assumes the AI will sometimes get it wrong, which is exactly why the enforcement layer doesn't depend on the AI cooperating. You also spent time auditing AI-generated code in our own repos and found real problems — so this is informed by having seen the failure modes, not theorized about them.

---

## 14. What I Learned — 40 sec

**On slide:** Three lessons

1. **Scale changes engineering.** 🔒
   > *"Error handling and safety mean something completely different at 1,600 machines than at one. The Dell story is that lesson in one example."*

   Reference it. Do **not** re-explain it.

2. **Automation is only worth what it enforces.** 🔒
   > *"A check that reports a problem is a suggestion. A check that blocks the merge is a rule. Same with the AI guardrails — a written rulebook and a hard block are not the same tool."*

   Two concrete referents behind it now (slides 11 and 13).

3. **The best fix is often removing a step, not adding one.** 🔒
   > *"My instinct on every one of these was to add more logic. The two changes I'm proudest of were realizing a step didn't need to happen at all, and refusing to do something halfway."*

   Covers the AppX reorder and the Dell all-or-nothing fix in one sentence.

---

## 15. Close — 35 sec

**On slide:** the thesis line alone — *Everything I built runs without me.* — with the status lines stacked underneath.

> *"X scripts and tools, and five things I'd call projects: the .NET framework, the Windows app automation, the onboarding site, the pipeline, and the AI guardrails. All of them are running right now. None of them need me to run."*
>
> *"The through-line: I came in thinking automation was about saving time. It's actually about doing the same thing correctly every time, on every machine, whether or not anyone's watching."*

Then thank them and stop. **Do not** trail off into "so yeah, that's about it."

---

# Appendix A — Numbers to pull before you present

| Number | Where | The line it unlocks |
|---|---|---|
| **Total script/tool count** | your repos + NinjaOne | Slide 4 exists or doesn't on this number |
| .NET findings at start vs. now | Tenable | *"Took it from X findings to zero, and it holds that line daily."* |
| Machines covered | Tenable / NinjaOne | Confirms 1,600 isn't theoretical |
| Windows-app findings before/after | Tenable | The AppX arc has no number at all right now |
| Machines that deferred cleanly to reboot | NinjaOne custom field | ⭐ *"On X machines it correctly chose to wait rather than risk it"* |
| Checks in the PR gate | your `ci.yaml` | Slide 10's count |
| New hires through the onboarding site | ask around | Turns slide 9's status line into evidence |
| **Procedures + reviewers built** | your `.claude/` folders | Slide 13's count |
| Deploy time by hand vs. now | your own estimate is fine | *"Deploys went from a manual file copy to zero-touch"* |

The reboot-defer count is the best number available to you and nobody would think to ask for it.

---

# Appendix B — Q&A answers to have ready

**"Why couldn't you just use Intune?"** ⚠️ **CONFIRM the framing with Will first** — don't characterize another admin's platform in a room he may be sitting in.
> *"Intune is owned by another admin on our team, and the Store path it would use for these apps is blocked by the same policy. NinjaOne is what reaches all 1,600 machines today, with the dry-run mode and reporting I needed."*

**"What happens when it fails on a machine?"** — The full Dell story. It defers, flags reboot-required, reports why, and doesn't leave the machine half-changed.

**"How do you test before running on 1,600 machines?"** — Dry-run mode, then one machine interactively, then the fleet. Say it in that order; it's the order you actually work in.

**"How do you know the fix worked?"** — Two independent checks: the tool re-inventories itself after it acts, and the scanner confirms separately on the next scan. *"I don't take the tool's word for it."*

**"What if Microsoft changes something?"** — It reads Microsoft's release data live rather than having versions baked in. Honest caveat if pressed: if Microsoft changed the *shape* of that data it would need attention — which is exactly what a maintainer is for.

**"What happens if the pipeline itself breaks?"** — It fails closed. If the checks can't run, nothing merges and nothing deploys. You also have a real story: the aggregate gate job hanging in a waiting state after its dependencies finished, traced to runner availability between job completion and gate eligibility.

**"Are the tests comprehensive?"** — No, and say so. They cover the access-control logic and a couple of components. The value was establishing that tests exist and run automatically. Overclaiming here is the easiest way to lose the room.

**"Which of these was hardest?"** — Decide in advance rather than improvising. The AppX work is the honest answer: no prior art at the company, and the hard part was people rather than machines.

**"What would you do with more time?"** — Also worth pre-deciding. Best answer connects the arcs: get the AI guardrails running inside the pipeline itself, so the explanation of a failure arrives before the developer goes looking for it.

---

# Appendix C — Delivery notes

**Watch your verbs.** "Helped with," "kind of," "just a script," "got to work on." This is the entire difference between a good presentation and a forgettable one. **Built. Designed. Deployed.**

**Say "framework" and "tool," not "script"** — except on slide 4, where "X scripts" is exactly right because volume is the point.

**Numbers are your structural motif.** Five inventory sources, seven checks, four layers, X scripts. Say each one out loud. A mixed audience can't evaluate your engineering; specific counts are the closest thing they have to evidence.

**Status lines are your visual motif.** Same position, same treatment, on slides 6, 8, 9, 10, 11. It gives the deck a spine.

**Slide 9 is your only real visual.** Everything else is words and diagrams. Give the onboarding screenshot room.

**Rehearse out loud with a timer.** First pass will run long. Cut in the order in the timing table.

**Leave out of the deck entirely** (fine in Q&A, dead air on a slide): specific error codes, the duplicate configuration block, prerelease version-string normalization, setup-registry cleanup scope, retry-with-backoff on downloads, the pass-gate hang, the TypeScript version pin, robocopy exit codes, reusable-workflow path constraints, lockfile hygiene, and the words AGENTS.md / skill / hook / subagent / agent.