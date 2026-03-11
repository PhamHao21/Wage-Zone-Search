<script>
  import '../app.css';
  import logo from '$lib/assets/logo.svg';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/logo.svg" /> 
  <title>Tra cứu lương tối thiểu theo khu vực</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
  <Header />
  
  <main class="flex-1 bg-gray-50 flex flex-col">
    {@render children?.()}
  </main>
  
  <Footer/>
</div>