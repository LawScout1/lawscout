<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>LawScout Solicitors</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <header class="site-header">
    <div class="container nav">
      <a class="brand" href="index.html">LawScout</a>
      <nav><a href="ask.html">Ask</a><a href="login.html">Sign in</a></nav>
    </div>
  </header>
  <main class="container narrow">
    <section class="section-heading solo">
      <h1>Speak to a solicitor</h1>
      <p>LawScout can later help connect users with a solicitor for advice on their situation.</p>
    </section>
    <section class="panel answer-section">
      <div class="question-grid compact-grid">
        <span class="question-card static">Employment</span>
        <span class="question-card static">Housing</span>
        <span class="question-card static">Family</span>
        <span class="question-card static">Immigration</span>
        <span class="question-card static">Personal injury</span>
        <span class="question-card static">Consumer disputes</span>
      </div>
      <form class="auth-form top-gap">
        <label>Name<input type="text" placeholder="Your name" /></label>
        <label>Email<input type="email" placeholder="you@example.com" /></label>
        <label>Area of law<input type="text" placeholder="Housing" /></label>
        <label>Location<input type="text" placeholder="Manchester" /></label>
        <label>Short summary<textarea placeholder="Briefly describe the issue"></textarea></label>
        <button class="button full" type="button">Request solicitor contact</button>
      </form>
    </section>
  </main>
</body>
</html>
