<script>
  import { writable } from "svelte/store";
  let isLoading = false;
  let resultText = writable("");
  const formData = {};
  const submit = async () => {
    isLoading = true;
    try {
      const response = await fetch("/api/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      resultText.set(
        result.result.success ? "Success!" : result.errors.join("\n"),
      );
    } catch (e) {
      resultText.set(e.message);
    } finally {
      isLoading = false;
    }
  };
</script>

<main>
  {#if isLoading}
    <div class="loader">
      <img src="../loader.gif" alt="loader" />
    </div>
  {:else}
    <form on:submit|preventDefault={submit}>
      <input
        name="email"
        type="email"
        placeholder="Enter your email"
        bind:value={formData.email}
      />
      <input
        name="name"
        type="text"
        placeholder="Enter your name"
        bind:value={formData.name}
      />
      <input
        name="password"
        type="password"
        placeholder="Enter your password"
        bind:value={formData.password}
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm password"
        bind:value={formData.confirmPassword}
      />
      <input type="submit" disabled={isLoading} />
    </form>
    <div>
      <p>{$resultText}</p>
    </div>
  {/if}
</main>

<style>
  :root {
    --black: #000;
    --primary-green: rgb(53, 235, 62);
    --hover-green: rgb(99, 197, 0);
    --white: #fff;
  }
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  form {
    border: 1px solid var(--black);
    padding: 20px;
    border-radius: 10px;
  }
  input[type="submit"] {
    margin-top: 20px;
    background-color: var(--primary-green);
    color: var(--white);
    cursor: pointer;
  }
  input[type="submit"]:hover {
    background-color: var(--hover-green);
  }
</style>
