Port flask-like functions to github pages
- Render template
- Routes
- Read/write files (probably require git authentication) -> might cancel

Anyways, so github pages ignores .env files, the question is... how is the webpage supposed to get it if nobody can. The whole conundrum is a fricking paradox. Javascript is executed via the client to unless there's some backend like flask, your chances of hiding stuff (without obfuscation) is.. null [unfunny joke]. There are potential ways to hide this token naturally through points of storage or encryption but the point is.... at this point, quite literally just why. What seems plausible, but likely abusable too is a queue. For whatever reason if you decide, hey I want automated write access, there can be a write to a queuefile that isn't actually published until verified by the user or backend server implemented.

Stackoverflow:

"You cannot hide JavaScript content from a programmer. They can always open the developer console and get all your variables.

What's worse, they can use said console to directly bypass any JavaScript validation, so it cannot be your primary security.

If it is something you must hide or secure against, you must look into a server side solution."

+ the network tab is a pain. another thing would be calling funcs right from console although that's still salvagable in a realistic sense so the best solution now would be to focus on other features, and although implement write features for whoever may use, advise not to use it unless obfuscated or some other mitigations are used. (probably not the level of complexity you'd see on github pages anyways)

To do: add /route/<anything>
add app class
add error handling (from funcs & 404)