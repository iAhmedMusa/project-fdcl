# Graph Report - /Users/fjrobin/Projects/focus-lab/src  (2026-04-22)

## Corpus Check
- Large corpus: 12448 files · ~12,095,287 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 106 nodes · 143 edges · 15 communities detected
- Extraction: 71% EXTRACTED · 29% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Profile Management|Profile Management]]
- [[_COMMUNITY_OTP Verification|OTP Verification]]
- [[_COMMUNITY_User & Walk-in Orders|User & Walk-in Orders]]
- [[_COMMUNITY_Registration UI|Registration UI]]
- [[_COMMUNITY_Registration & SMS|Registration & SMS]]
- [[_COMMUNITY_Customer Management|Customer Management]]
- [[_COMMUNITY_User Administration|User Administration]]
- [[_COMMUNITY_Login Authentication|Login Authentication]]
- [[_COMMUNITY_OTP Verification UI|OTP Verification UI]]
- [[_COMMUNITY_Phone OTP UI|Phone OTP UI]]
- [[_COMMUNITY_Profile Form UI|Profile Form UI]]
- [[_COMMUNITY_Customer Layout|Customer Layout]]
- [[_COMMUNITY_Auth Routes|Auth Routes]]
- [[_COMMUNITY_Web Routes|Web Routes]]
- [[_COMMUNITY_Service Config|Service Config]]

## God Nodes (most connected - your core abstractions)
1. `User` - 27 edges
2. `Otp` - 11 edges
3. `WalkInOrderController` - 8 edges
4. `CustomerController` - 7 edges
5. `OtpController` - 6 edges
6. `ProfileController` - 6 edges
7. `LoginRequest` - 6 edges
8. `UserController` - 5 edges
9. `SmsService` - 5 edges
10. `RegisteredUserController` - 4 edges

## Surprising Connections (you probably didn't know these)
- None detected - all connections are within the same source files.

## Communities

### Community 0 - "Profile Management"
Cohesion: 0.14
Nodes (3): ProfileController, ProfileUpdateRequest, User

### Community 1 - "OTP Verification"
Cohesion: 0.25
Nodes (2): Otp, OtpController

### Community 2 - "User & Walk-in Orders"
Cohesion: 0.19
Nodes (2): up(), WalkInOrderController

### Community 3 - "Registration UI"
Cohesion: 0.18
Nodes (3): inputCls(), isValidPhone(), Register()

### Community 4 - "Registration & SMS"
Cohesion: 0.24
Nodes (2): RegisteredUserController, SmsService

### Community 5 - "Customer Management"
Cohesion: 0.27
Nodes (2): up(), CustomerController

### Community 6 - "User Administration"
Cohesion: 0.22
Nodes (1): UserController

### Community 7 - "Login Authentication"
Cohesion: 0.43
Nodes (1): LoginRequest

### Community 8 - "OTP Verification UI"
Cohesion: 1.0
Nodes (0): 

### Community 9 - "Phone OTP UI"
Cohesion: 1.0
Nodes (0): 

### Community 10 - "Profile Form UI"
Cohesion: 1.0
Nodes (0): 

### Community 11 - "Customer Layout"
Cohesion: 1.0
Nodes (0): 

### Community 12 - "Auth Routes"
Cohesion: 1.0
Nodes (0): 

### Community 13 - "Web Routes"
Cohesion: 1.0
Nodes (0): 

### Community 14 - "Service Config"
Cohesion: 1.0
Nodes (0): 

## Knowledge Gaps
- **Thin community `OTP Verification UI`** (2 nodes): `VerifyOtp.jsx`, `VerifyOtp()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Phone OTP UI`** (2 nodes): `VerifyPhoneOtp.jsx`, `VerifyPhoneOtp()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Profile Form UI`** (2 nodes): `UpdateProfileInformation()`, `UpdateProfileInformationForm.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Customer Layout`** (2 nodes): `CustomerLayout()`, `CustomerLayout.jsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Auth Routes`** (1 nodes): `auth.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Web Routes`** (1 nodes): `web.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Service Config`** (1 nodes): `services.php`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `User` connect `Profile Management` to `OTP Verification`, `User & Walk-in Orders`, `Registration & SMS`, `Customer Management`, `User Administration`, `Login Authentication`?**
  _High betweenness centrality (0.456) - this node is a cross-community bridge._
- **Why does `Otp` connect `OTP Verification` to `Profile Management`, `Registration & SMS`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._
- **Are the 17 inferred relationships involving `User` (e.g. with `.verify()` and `.sendOtp()`) actually correct?**
  _`User` has 17 INFERRED edges - model-reasoned connections that need verification._
- **Are the 6 inferred relationships involving `Otp` (e.g. with `.verify()` and `.resend()`) actually correct?**
  _`Otp` has 6 INFERRED edges - model-reasoned connections that need verification._
- **Should `Profile Management` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._