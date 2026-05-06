# landing-findjob

Landing page de pre-inscription pour **findjob237**. HTML statique pur,
pas de framework, pas de build. Hebergee sur **Cloudflare Pages**.
Formulaire propulse par **Web3Forms** (gratuit illimite).

## Structure

```
landing-findjob/
├── index.html       contenu + form
├── style.css        theme vert/blanc, mobile-first
├── script.js        soumission AJAX du form
├── favicon.svg
└── README.md
```

## Setup en 4 etapes

### 1. Creer un compte Web3Forms (30 secondes)

1. Va sur https://web3forms.com
2. Entre ton email (celui ou tu veux recevoir les notifications)
3. Tu recois ta **access key** par mail (un truc comme `abcd1234-...`)

### 2. Brancher la cle dans `index.html`

Cherche la ligne :
```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY" />
```
Et remplace `YOUR_ACCESS_KEY` par ta cle.

> ⚠️ La cle est cote client (public). Web3Forms le sait — la cle ne donne acces
> a rien d'autre qu'a soumettre des formulaires vers TON email. Pas de risque.

### 3. Tester localement

```bash
# Dans le dossier landing-findjob
python3 -m http.server 8000
# Puis ouvre http://localhost:8000
```

Soumets un formulaire test → tu dois recevoir un mail dans la minute.

### 4. Deployer sur Cloudflare Pages

#### Option A : via dashboard Cloudflare (le plus simple)
1. Push ce dossier sur GitHub (`gh repo create landing-findjob --public --source=. --push`)
2. Cloudflare Pages → "Create a project" → "Connect to Git"
3. Selectionne le repo, branche `main`
4. Build command : (laisser vide)
5. Build output directory : `/`
6. Deploy. Tu auras une URL `landing-findjob.pages.dev` en moins de 60 secondes.

#### Option B : via wrangler CLI
```bash
npm install -g wrangler
wrangler pages deploy . --project-name=findjob-landing
```

### 5. (Plus tard) Domaine personnalise

Quand tu auras un domaine (ex : `findjob237.com`), tu l'ajoutes dans
Cloudflare Pages → Custom domains. DNS automatique si le domaine est
chez Cloudflare, sinon CNAME standard.

## Synchronisation Google Sheets (optionnel mais recommande)

Web3Forms n'a pas d'integration Sheets native, mais avec **n8n**
(self-hostable, gratuit) ou **Zapier** (gratuit jusqu'a 100 zaps/mois) :

1. Trigger : "Email received" sur ton boite mail
2. Action : "Append row to Google Sheet"
3. Map les champs (phone, city, domain) du body de l'email vers les colonnes

Alternative : utilise un Google Form + Google Sheet directement,
poste la landing page vers le Form via JS. C'est moche mais natif.

## Bascule vers Tally (si tu prefereras)

Si Web3Forms ne te convient pas, retire le `<form>` et remplace par :
```html
<iframe src="https://tally.so/embed/YOUR_FORM_ID?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy" width="100%" height="500" frameborder="0" style="border:0"></iframe>
```

## Bascule vers le backend Django (V2)

Le jour ou ton backend est en ligne, change l'`action` du form :
```html
<form action="https://api.findjob237.com/api/v1/waitlist" method="POST">
```
Cote backend, ajoute un endpoint qui ecrit dans une table `Waitlist`.
0 autre changement cote landing.

## Performance cible

- Lighthouse mobile > 95
- First Contentful Paint < 1.5s sur 3G
- Total page weight < 100 KB (CSS + JS, sans la font)

Aucune dependance, aucun tracker tiers. Si tu veux ajouter de l'analytics,
**Cloudflare Web Analytics** est gratuit, sans cookies, RGPD-friendly.
