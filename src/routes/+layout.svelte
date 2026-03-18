<script>
  import '../app.css';
  import Header from '../components/Header.svelte';
  import Footer from '../components/Footer.svelte';
  
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" type="image/svg+xml" href="/logo.svg" /> 
  <title>Tra cứu lương tối thiểu theo khu vực 2026</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
</svelte:head>

<div class="h-[100dvh] flex flex-col overflow-hidden bg-slate-50 font-sans">
  <Header />
  
  <main class="flex-1 relative min-h-0 w-full overflow-hidden flex flex-col">
    {@render children?.()}
  </main>
  
  <Footer/>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100%;
    overscroll-behavior-y: contain;
  }
</style>
