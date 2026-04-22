# Graph Report - resources/js  (2026-04-23)

## Corpus Check
- 82 files · ~62,052 words
- Verdict: corpus large enough — graph structure adds value.

## Summary
- 210 nodes · 159 edges · 58 communities detected
- Extraction: 89% EXTRACTED · 11% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Landing Page Sections|Landing Page Sections]]
- [[_COMMUNITY_Layout Components|Layout Components]]
- [[_COMMUNITY_UI Component Library|UI Component Library]]
- [[_COMMUNITY_Icon Components|Icon Components]]
- [[_COMMUNITY_Order Wizard Flow|Order Wizard Flow]]
- [[_COMMUNITY_Photo Studio Service|Photo Studio Service]]
- [[_COMMUNITY_Auth UI Components|Auth UI Components]]
- [[_COMMUNITY_Admin Dashboard Cards|Admin Dashboard Cards]]
- [[_COMMUNITY_Theme System|Theme System]]
- [[_COMMUNITY_Dropdown Component|Dropdown Component]]
- [[_COMMUNITY_Staff Order Creation|Staff Order Creation]]
- [[_COMMUNITY_Customer List|Customer List]]
- [[_COMMUNITY_Customer Detail|Customer Detail]]
- [[_COMMUNITY_Photo Upload|Photo Upload]]
- [[_COMMUNITY_Dashboard Filter|Dashboard Filter]]
- [[_COMMUNITY_Album Pages|Album Pages]]
- [[_COMMUNITY_Frame Pages|Frame Pages]]
- [[_COMMUNITY_Mug Pages|Mug Pages]]
- [[_COMMUNITY_Dashboard Pages|Dashboard Pages]]
- [[_COMMUNITY_Order Detail Pages|Order Detail Pages]]
- [[_COMMUNITY_Appointments|Appointments]]
- [[_COMMUNITY_App Bootstrap|App Bootstrap]]
- [[_COMMUNITY_Responsive Nav Link|Responsive Nav Link]]
- [[_COMMUNITY_App Wrapper|App Wrapper]]
- [[_COMMUNITY_Danger Button|Danger Button]]
- [[_COMMUNITY_Secondary Button|Secondary Button]]
- [[_COMMUNITY_Input Error|Input Error]]
- [[_COMMUNITY_Checkbox|Checkbox]]
- [[_COMMUNITY_FadeIn Animation|FadeIn Animation]]
- [[_COMMUNITY_Modal|Modal]]
- [[_COMMUNITY_Input Label|Input Label]]
- [[_COMMUNITY_Application Logo|Application Logo]]
- [[_COMMUNITY_Nav Link|Nav Link]]
- [[_COMMUNITY_Primary Button|Primary Button]]
- [[_COMMUNITY_Order Summary|Order Summary]]
- [[_COMMUNITY_Step Indicator|Step Indicator]]
- [[_COMMUNITY_Reprint Page|Reprint Page]]
- [[_COMMUNITY_Photo Reprint|Photo Reprint]]
- [[_COMMUNITY_Verify Email|Verify Email]]
- [[_COMMUNITY_Verify OTP|Verify OTP]]
- [[_COMMUNITY_Product Form|Product Form]]
- [[_COMMUNITY_Products Index|Products Index]]
- [[_COMMUNITY_Users Index|Users Index]]
- [[_COMMUNITY_User Show|User Show]]
- [[_COMMUNITY_Orders Index|Orders Index]]
- [[_COMMUNITY_Order Show|Order Show]]
- [[_COMMUNITY_Reports Index|Reports Index]]
- [[_COMMUNITY_Profile Edit|Profile Edit]]
- [[_COMMUNITY_Profile Update Form|Profile Update Form]]
- [[_COMMUNITY_Delete User Form|Delete User Form]]
- [[_COMMUNITY_Verify Phone OTP|Verify Phone OTP]]
- [[_COMMUNITY_Edit Order|Edit Order]]
- [[_COMMUNITY_Photo Storage Index|Photo Storage Index]]
- [[_COMMUNITY_Photo Storage Show|Photo Storage Show]]
- [[_COMMUNITY_Bootstrap|Bootstrap]]
- [[_COMMUNITY_Text Input|Text Input]]
- [[_COMMUNITY_English Translations|English Translations]]
- [[_COMMUNITY_Bangla Translations|Bangla Translations]]

## God Nodes (most connected - your core abstractions)
1. `useLanguage()` - 11 edges
2. `useFlash()` - 8 edges
3. `Services()` - 3 edges
4. `LandingLayout()` - 3 edges
5. `Home()` - 3 edges
6. `getMinDate()` - 3 edges
7. `PhotoStudio()` - 3 edges
8. `Register()` - 3 edges
9. `useTheme()` - 2 edges
10. `ThemeToggle()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Testimonials()` --calls--> `useLanguage()`  [INFERRED]
  resources/js/Components/Landing/Testimonials.jsx → resources/js/contexts/LanguageContext.jsx
- `About()` --calls--> `useLanguage()`  [INFERRED]
  resources/js/Components/Landing/About.jsx → resources/js/contexts/LanguageContext.jsx
- `FAQ()` --calls--> `useLanguage()`  [INFERRED]
  resources/js/Components/Landing/FAQ.jsx → resources/js/contexts/LanguageContext.jsx
- `Hero()` --calls--> `useLanguage()`  [INFERRED]
  resources/js/Components/Landing/Hero.jsx → resources/js/contexts/LanguageContext.jsx
- `Gallery()` --calls--> `useLanguage()`  [INFERRED]
  resources/js/Components/Landing/Gallery.jsx → resources/js/contexts/LanguageContext.jsx

## Communities

### Community 0 - "Landing Page Sections"
Cohesion: 0.08
Nodes (10): About(), Contact(), FAQ(), Gallery(), Hero(), Home(), useLanguage(), Locations() (+2 more)

### Community 1 - "Layout Components"
Cohesion: 0.12
Nodes (8): AdminLayout(), AuthenticatedLayout(), CustomerLayout(), GuestLayout(), LandingLayout(), OrderLayout(), StaffLayout(), useFlash()

### Community 2 - "UI Component Library"
Cohesion: 0.14
Nodes (0): 

### Community 3 - "Icon Components"
Cohesion: 0.18
Nodes (3): inputCls(), isValidPhone(), Register()

### Community 4 - "Order Wizard Flow"
Cohesion: 0.29
Nodes (2): allowsMultiplePhotos(), Step3()

### Community 5 - "Photo Studio Service"
Cohesion: 0.53
Nodes (4): getMinDate(), getTodayString(), isFriday(), PhotoStudio()

### Community 6 - "Auth UI Components"
Cohesion: 0.33
Nodes (0): 

### Community 7 - "Admin Dashboard Cards"
Cohesion: 0.33
Nodes (0): 

### Community 8 - "Theme System"
Cohesion: 0.4
Nodes (2): useTheme(), ThemeToggle()

### Community 9 - "Dropdown Component"
Cohesion: 0.4
Nodes (0): 

### Community 10 - "Staff Order Creation"
Cohesion: 0.5
Nodes (0): 

### Community 11 - "Customer List"
Cohesion: 0.5
Nodes (0): 

### Community 12 - "Customer Detail"
Cohesion: 0.5
Nodes (0): 

### Community 13 - "Photo Upload"
Cohesion: 0.67
Nodes (0): 

### Community 14 - "Dashboard Filter"
Cohesion: 0.67
Nodes (0): 

### Community 15 - "Album Pages"
Cohesion: 0.67
Nodes (1): Album()

### Community 16 - "Frame Pages"
Cohesion: 0.67
Nodes (1): Frame()

### Community 17 - "Mug Pages"
Cohesion: 0.67
Nodes (1): Mug()

### Community 18 - "Dashboard Pages"
Cohesion: 0.67
Nodes (1): Dashboard()

### Community 19 - "Order Detail Pages"
Cohesion: 0.67
Nodes (1): OrderDetail()

### Community 20 - "Appointments"
Cohesion: 0.67
Nodes (0): 

### Community 21 - "App Bootstrap"
Cohesion: 1.0
Nodes (0): 

### Community 22 - "Responsive Nav Link"
Cohesion: 1.0
Nodes (0): 

### Community 23 - "App Wrapper"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Danger Button"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Secondary Button"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Input Error"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Checkbox"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "FadeIn Animation"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Modal"
Cohesion: 1.0
Nodes (0): 

### Community 30 - "Input Label"
Cohesion: 1.0
Nodes (0): 

### Community 31 - "Application Logo"
Cohesion: 1.0
Nodes (0): 

### Community 32 - "Nav Link"
Cohesion: 1.0
Nodes (0): 

### Community 33 - "Primary Button"
Cohesion: 1.0
Nodes (0): 

### Community 34 - "Order Summary"
Cohesion: 1.0
Nodes (0): 

### Community 35 - "Step Indicator"
Cohesion: 1.0
Nodes (0): 

### Community 36 - "Reprint Page"
Cohesion: 1.0
Nodes (0): 

### Community 37 - "Photo Reprint"
Cohesion: 1.0
Nodes (0): 

### Community 38 - "Verify Email"
Cohesion: 1.0
Nodes (0): 

### Community 39 - "Verify OTP"
Cohesion: 1.0
Nodes (0): 

### Community 40 - "Product Form"
Cohesion: 1.0
Nodes (0): 

### Community 41 - "Products Index"
Cohesion: 1.0
Nodes (0): 

### Community 42 - "Users Index"
Cohesion: 1.0
Nodes (0): 

### Community 43 - "User Show"
Cohesion: 1.0
Nodes (0): 

### Community 44 - "Orders Index"
Cohesion: 1.0
Nodes (0): 

### Community 45 - "Order Show"
Cohesion: 1.0
Nodes (0): 

### Community 46 - "Reports Index"
Cohesion: 1.0
Nodes (0): 

### Community 47 - "Profile Edit"
Cohesion: 1.0
Nodes (0): 

### Community 48 - "Profile Update Form"
Cohesion: 1.0
Nodes (0): 

### Community 49 - "Delete User Form"
Cohesion: 1.0
Nodes (0): 

### Community 50 - "Verify Phone OTP"
Cohesion: 1.0
Nodes (0): 

### Community 51 - "Edit Order"
Cohesion: 1.0
Nodes (0): 

### Community 52 - "Photo Storage Index"
Cohesion: 1.0
Nodes (0): 

### Community 53 - "Photo Storage Show"
Cohesion: 1.0
Nodes (0): 

### Community 54 - "Bootstrap"
Cohesion: 1.0
Nodes (0): 

### Community 55 - "Text Input"
Cohesion: 1.0
Nodes (0): 

### Community 56 - "English Translations"
Cohesion: 1.0
Nodes (0): 

### Community 57 - "Bangla Translations"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `App Bootstrap`** (2 nodes): `setup()`, `app.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Responsive Nav Link`** (2 nodes): `ResponsiveNavLink.jsx`, `ResponsiveNavLink()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `App Wrapper`** (2 nodes): `AppWrapper()`, `AppWrapper.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Danger Button`** (2 nodes): `DangerButton()`, `DangerButton.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Secondary Button`** (2 nodes): `SecondaryButton.jsx`, `SecondaryButton()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Input Error`** (2 nodes): `InputError()`, `InputError.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Checkbox`** (2 nodes): `Checkbox()`, `Checkbox.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `FadeIn Animation`** (2 nodes): `FadeIn()`, `FadeIn.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Modal`** (2 nodes): `Modal()`, `Modal.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Input Label`** (2 nodes): `InputLabel()`, `InputLabel.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Application Logo`** (2 nodes): `ApplicationLogo()`, `ApplicationLogo.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Nav Link`** (2 nodes): `NavLink()`, `NavLink.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Primary Button`** (2 nodes): `PrimaryButton()`, `PrimaryButton.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Order Summary`** (2 nodes): `OrderSummary()`, `OrderSummary.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Step Indicator`** (2 nodes): `StepIndicator.jsx`, `StepIndicator()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Reprint Page`** (2 nodes): `Reprint()`, `Reprint.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Photo Reprint`** (2 nodes): `PhotoReprint()`, `PhotoReprint.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Verify Email`** (2 nodes): `VerifyEmail.jsx`, `VerifyEmail()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Verify OTP`** (2 nodes): `VerifyOtp.jsx`, `VerifyOtp()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Product Form`** (2 nodes): `ProductForm()`, `Form.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Products Index`** (2 nodes): `ProductsIndex()`, `Index.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Users Index`** (2 nodes): `UsersIndex()`, `Index.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `User Show`** (2 nodes): `Show.jsx`, `UsersShow()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Orders Index`** (2 nodes): `OrdersIndex()`, `Index.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Order Show`** (2 nodes): `Show.jsx`, `OrdersShow()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Reports Index`** (2 nodes): `ReportsIndex()`, `Index.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Profile Edit`** (2 nodes): `Edit()`, `Edit.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Profile Update Form`** (2 nodes): `UpdateProfileInformationForm.jsx`, `UpdateProfileInformation()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Delete User Form`** (2 nodes): `DeleteUserForm()`, `DeleteUserForm.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Verify Phone OTP`** (2 nodes): `VerifyPhoneOtp.jsx`, `VerifyPhoneOtp()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Edit Order`** (2 nodes): `EditOrder()`, `EditOrder.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Photo Storage Index`** (2 nodes): `Index()`, `Index.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Photo Storage Show`** (2 nodes): `Show.jsx`, `Show()`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Bootstrap`** (1 nodes): `bootstrap.js`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Text Input`** (1 nodes): `TextInput.jsx`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `English Translations`** (1 nodes): `en.js`
  Cluster too small — noise or needs more connections extracted.
- **Thin community `Bangla Translations`** (1 nodes): `bn.js`
  Cluster too small — noise or needs more connections extracted.

## Suggested Questions
_Questions this graph uniquely positioned to answer:_

- **Why does `useLanguage()` connect `Landing Page Sections` to `Layout Components`?**
  _High betweenness centrality (0.029) — cross-community bridge._
- **Why does `LandingLayout()` connect `Layout Components` to `Landing Page Sections`?**
  _High betweenness centrality (0.019) — cross-community bridge._
- **Are the 10 inferred relationships involving `useLanguage()` (e.g. with `Testimonials()` and `About()`) actually correct?**
  _`useLanguage()` has 10 INFERRED edges — model-reasoned connections needing verification._
- **Are the 7 inferred relationships involving `useFlash()` (e.g. with `StaffLayout()` and `AdminLayout()`) actually correct?**
  _`useFlash()` has 7 INFERRED edges — model-reasoned connections needing verification._
- **Are the 2 inferred relationships involving `LandingLayout()` (e.g. with `useFlash()` and `useLanguage()`) actually correct?**
  _`LandingLayout()` has 2 INFERRED edges — model-reasoned connections needing verification._
- **Should `Landing Page Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.08 — nodes weakly interconnected._
- **Should `Layout Components` be split into smaller, more focused modules?**
  _Cohesion score 0.12 — nodes weakly interconnected._