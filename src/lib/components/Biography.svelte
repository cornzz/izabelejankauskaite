<script lang="ts">
	import { slide } from 'svelte/transition'

	let showMore: boolean = false
    let section: HTMLElement
</script>

<div
	id="biography"
	class="relative z-10 flex min-h-screen flex-col justify-end bg-[aliceblue] py-20 md:flex-row"
    bind:this={section}
>
	<div class="px-12 py-[3.75rem] md:w-1/2 mx-auto lg:px-32">
		<img class="max-h-[75vh] max-w-full" src="/images/biography.jpg" alt="Portrait - Izabelė Jankauskaitė" />
	</div>
	<div class="px-6 leading-loose md:w-1/2 lg:pl-0 lg:pr-12">
		<h1 class="mb-5 text-2xl">Biography</h1>
		<p>
			The 25-year-old Lithuanian conductor Izabelė Jankauskaitė first attracted international attention in 2022 when she
			won the Neeme Järvi Prize at the renowned Gstaad Conducting Academy. From August 2022 to June 2023 she was
			Assistant Conductor of the Tonhalle-Orchester Zürich under Paavo Järvi.
		</p>
		<p>
			In the 2023/2024 season she will return to the Tonhalle-Orchester Zürich for a family concert. In addition, she
			will make her debut with the hr-Sinfonieorchester, the Münchener Symphoniker, the Musikkollegium Winterthur and
			the Berner Symphonieorchester in the coming season. Further invitations will take her to the Orchestre de Chambre
			de Lausanne, the Orquesta de Extremadura, the Filarmonica Banatul Timișoara and the Folkwang Kammerorchester
			Essen, among others. In autumn 2023 she will assist Nicholas Carter in a production of Puccini's opera "Tosca" at
			the Stadttheater Bern.
		</p>
		<p>
			Izabelė Jankauskaitė has attended numerous master classes with conductors such as Jaap van Zweden, Kristjan Järvi,
			Baldur Brönnimann, Paavo Järvi, Leonid Grin and James Lowe. In June 2023 she assisted Michael Tilson Thomas with
			the Tonhalle-Orchester Zürich. During her studies she conducted the Göttingen Symphony Orchestra, the
			Südwestdeutsche Philharmonie Konstanz, the Sofia Philharmonic Orchestra, the Hradec Králové Philharmonic
			Orchestra, the Collegium Musicum Basel, the Central Switzerland Youth Symphony Orchestra and the Swiss Youth
			Symphony Orchestra. She has worked with the Theater Orchester Biel Solothurn and the Württemberges Kammerorchester
			Heilbronn.
		</p>
		{#if showMore}
			<div transition:slide>
				<p>
					In 2017, she won first prize at the Jonas Aleksa Choir Conducting Competition. From 2019 to 2022 she was choir
					director of the Johannes Choir Mellingen and the Stadtsänger Winterthur.
				</p>
				<p>
					Izabelė Jankauskaitė was born in Vilnius, Lithuania. She received her first music lessons at the National M.
					K. Čiurlionis School of Art. Later, she took up vocal studies at the Lithuanian Academy of Music and Theatre.
					In 2018, she continued her musical education at the Zurich University of the Arts, initially in choral
					conducting. In 2020, she switched to orchestral conducting in the class of Prof. Johannes Schlaefli. She is
					currently studying in Zurich with Johannes Schlaefli and Christoph-Mathias Mueller.
				</p>
				SEASON 2023/2024
			</div>
		{/if}
		<br />
		<button class="underline" on:click={() => {
            showMore = !showMore
            if (!showMore) section.scrollIntoView()
        }}>
			{!showMore ? 'Show More' : 'Show Less'}
		</button>
	</div>
</div>

<style lang="postcss">
	p {
		@apply mb-4;
	}
</style>
