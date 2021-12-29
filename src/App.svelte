<script>
  let url = "/api/sendMail";
  const myFormData = {};

  const submitHandler = async (event) => {
    const formLoader = document.querySelector(".loader");
    const formMessage = document.querySelector(".form__message");

    document.querySelector('input[type="submit"]').disabled = true;
    formLoader.classList.remove("display_none");

    try {
      const promice = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(myFormData),
      });
      let status = promice.status;
      if (status == 200) {
        formMessage.innerText = "Sucsessful!";
      } else if (status == 402) {
        formMessage.innerText = "Validation error!";
      } else if (status == 429) {
        formMessage.innerText = "Too many requests!";
      }
    } catch (exception) {
      formMessage.innerText = "Unexpected error!";
    }
    document.querySelector('input[type="submit"]').disabled = false;
    formLoader.classList.add("display_none");
    formLoader.classList.remove("display_block");
  };
</script>

<main>
  <form class="form" on:submit|preventDefault={submitHandler}>
    <p class="form__message">error</p>
    <input
      name="email"
      type="email"
      id="email"
      placeholder="Enter your email"
      bind:value={myFormData.email}
    />
    <input
      name="password"
      type="password"
      id="password"
      placeholder="Enter your password"
      bind:value={myFormData.password}
    />
    <input
      name="confirmPassword"
      type="password"
      id="confpassword"
      placeholder="Confirm your password"
      bind:value={myFormData.confirmPassword}
    />
    <input
      name="number"
      type="text"
      id="phonenumber"
      placeholder="Enter your number"
      bind:value={myFormData.number}
    />
    <input type="submit" />
    <div class="loader display_block display_none">Loading...</div>
  </form>
</main>

<style>
  :root {
    --background-color: #fff;
    --loader-color: rgb(255, 0, 0);
    --button-hover: #4caf50;
  }

  .display_none {
    display: none;
  }

  .display_block {
    display: block;
  }

  .form__message {
    visibility: hidden;
  }

  .loader {
    font-size: 10px;
    margin: 50px auto;
    text-indent: -9999em;
    width: 11em;
    height: 11em;
    border-radius: 50%;
    background: var(--background-color);
    background: -moz-linear-gradient(
      left,
      var(--background-color) 10%,
      rgba(255, 0, 0, 0) 42%
    );
    background: -webkit-linear-gradient(
      left,
      var(--background-color) 10%,
      rgba(255, 0, 0, 0) 42%
    );
    background: -o-linear-gradient(
      left,
      var(--background-color) 10%,
      rgba(255, 0, 0, 0) 42%
    );
    background: -ms-linear-gradient(
      left,
      var(--background-color) 10%,
      rgba(255, 0, 0, 0) 42%
    );
    background: linear-gradient(
      to right,
      var(--background-color) 10%,
      rgba(255, 0, 0, 0) 42%
    );
    position: relative;
    -webkit-animation: load3 1.4s infinite linear;
    animation: load3 1.4s infinite linear;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
  }
  .loader:before {
    width: 50%;
    height: 50%;
    background: var(--loader-color);
    border-radius: 100% 0 0 0;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
  }
  .loader:after {
    background: var(--background-color);
    width: 75%;
    height: 75%;
    border-radius: 50%;
    content: "";
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
  @-webkit-keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  @keyframes load3 {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 70vh;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
