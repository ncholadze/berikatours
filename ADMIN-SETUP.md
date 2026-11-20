# ადმინ პანელის დაყენება (ერთჯერადი, ~20 წუთი)

ადმინ პანელი: **https://berikatours.ge/admin/**. ვახო შედის ელ-ფოსტით და პაროლით და მართავს ტურებს, კონტაქტებს, ფოტოებს და გალერეას.
ყოველი შენახვის შემდეგ საიტი თავისით განახლდება 2–3 წუთში.

დაყენებისთვის 4 ნაბიჯია. ყველაფერი კომპიუტერის ბრაუზერიდან კეთდება.

---

## 1. Supabase პროექტი

1. გახსენით **https://supabase.com** → **Start your project** და დარეგისტრირდით (უფასოა).
2. **New project**:
   - Name: `berikatours`
   - Database Password: მოიფიქრეთ და **შეინახეთ**
   - Region: **Central EU (Frankfurt)**, საქართველოსთან ყველაზე ახლოს
3. დაელოდეთ პროექტის შექმნას, დაახლოებით 1–2 წუთი.

## 2. მონაცემთა ბაზა

მარცხენა მენიუში **SQL Editor** → **New query**:

1. ჩასვით ფაილის **`supabase/setup.sql`** მთელი ტექსტი → **Run**. ასე იქმნება ცხრილები, წვდომის წესები და ფოტოების საცავი.
2. ახალ query-ში ჩასვით **`supabase/seed.sql`** → **Run**. ასე გადადის ბაზაში ახლანდელი 8 ტური და კონტაქტები.

## 3. ვახოს ანგარიში

1. **Authentication → Users → Add user → Create new user**:
   - Email: `vakhushtiberika@gmail.com`
   - Password: ვახოს პაროლი
   - მონიშნეთ **Auto Confirm User** → **Create user**
2. **SQL Editor**-ში გაუშვით ეს ბრძანება, რომ ამ ანგარიშს ადმინის უფლება მიეცეს:
   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'vakhushtiberika@gmail.com';
   ```
3. უსაფრთხოებისთვის გამორთეთ ახალი ანგარიშების თვითრეგისტრაცია: **Authentication → Sign In / Providers → Email** → გამორთეთ **Allow new users to sign up** → **Save**.
   თუ ჩართული დარჩება, უცხო ანგარიშს მაინც არაფრის შეცვლა არ შეეძლება, მაგრამ გამორთვა სჯობს.

## 4. საიტის ავტომატური განახლება (GitHub-თან კავშირი)

**ა) GitHub token:**
1. GitHub → თქვენი ფოტო → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**.
2. პარამეტრები:
   - Token name: `berikatours-supabase`
   - Expiration: ყველაზე გრძელი ვადა
   - Repository access: **Only select repositories** → `berikatours`
   - Permissions → Repository permissions → **Contents: Read and write**
3. **Generate token** → დააკოპირეთ (`github_pat_...`).

**ბ) Supabase-ში შენახვა:** SQL Editor-ში გაუშვით. ჩასვით თქვენი token და GitHub-ის მომხმარებლის სახელი:
```sql
select vault.create_secret('github_pat_ᲗᲥᲕᲔᲜᲘ_TOKEN', 'github_token');
select vault.create_secret('ᲗᲥᲕᲔᲜᲘ_GITHUB_ᲡᲐᲮᲔᲚᲘ/berikatours', 'github_repo');
```
Token ინახება Supabase-ის დაცულ საცავში (Vault) და კოდში არსად ჩანს.

**გ) პროექტის მისამართი და საჯარო გასაღები:**
**Project Settings → Data API** (ან **API Keys**) → დააკოპირეთ:
- **Project URL** (`https://xxxx.supabase.co`)
- **anon public** key (`eyJ...`), ან **Publishable key**, თუ ასე ჰქვია

ორივე ჩაწერეთ ფაილში **`src/config/supabase.ts`** (`URL` და `ANON_KEY`), ან გამოუგზავნეთ დეველოპერს.
ეს ორი მნიშვნელობა საჯაროა, ბრაუზერში ისედაც ჩანს. დაცვას ბაზის წესები უზრუნველყოფს. **service_role / secret key არასდროს ჩაწეროთ კოდში.**

---

## მზადაა

ატვირთეთ ცვლილება GitHub-ზე. 2–3 წუთის შემდეგ გახსენით **https://berikatours.ge/admin/** და შედით ვახოს ელ-ფოსტით და პაროლით.

## კარგი იქნება, თუ იცით

- **ცვლილების გამოჩენა:** ყოველი შენახვის შემდეგ საიტი 2–3 წუთში განახლდება. ღილაკი „🔄 საიტის განახლება“ ხელით აახლებს.
- **შეცდომის დაცვა:** ტური რომელიმე ენის გარეშე ვერ შეინახება, პანელი გეტყვით, რა აკლია. თუ რამე მაინც არასწორად მოხვდება, საიტი არ განახლდება და ძველი ვერსია დარჩება.
- **უფასო Supabase:** პროექტი 7 დღიანი უმოქმედობის შემდეგ „იძინებს“. ამიტომ საიტი ავტომატურად ყოველ 3 დღეში ერთხელ აეწყობა, რაც პროექტს აქტიურს ინახავს. თუ მაინც დაიძინა, Supabase-ში დააჭირეთ **Restore project**.
- **GitHub token-ს ვადა გასდის.** ამის მერე შენახვის შემდეგ საიტი თავისით აღარ განახლდება. შექმენით ახალი token და SQL Editor-ში გაუშვით:
  ```sql
  select vault.update_secret((select id from vault.secrets where name = 'github_token'), 'github_pat_ᲐᲮᲐᲚᲘ_TOKEN');
  ```
- **პაროლის აღდგენა:** Supabase → Authentication → Users → მომხმარებელი → **Send password recovery** ან ახალი პაროლის დაყენება.
- **ძველი 4 ფოტო გალერეაში** კოდშია (`src/assets/gallery/`) და ადმინიდან არ იშლება. ადმინიდან ატვირთული ფოტოები მათ შემდეგ ჩნდება.
