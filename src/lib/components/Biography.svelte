<script lang="ts">
	const bio: string = `
		Izabelė Jankauskaitė is among the most promising conductors of her generation. The Lithuanian conductor impresses with her inspiring presence on the podium, precise rehearsal technique, and striking stylistic versatility. Her artistic voice is increasingly recognised on the international stage, reflected in her growing presence on Europe’s concert platforms.

		Jankauskaitė first attracted major attention in 2022 when she won the prestigious Neeme Järvi Prize at the Gstaad Conducting Academy. Since then, she has regularly appeared with renowned orchestras. In the 2024/25 season she served as Assistant Conductor of the hr-Sinfonieorchester Frankfurt, working closely with Chief Conductor Alain Altinoglu. From August 2022 to June 2023, she held the same position at the Tonhalle-Orchester Zürich under Paavo Järvi.

		In the 2025/26 season, Izabelė Jankauskaitė returns to the Royal Stockholm Philharmonic, the Münchner Symphoniker and the Orquesta de Extremadura. Highlights of the season include her Finnish debuts with the Helsinki Philharmonic, Tapiola Sinfonietta and Lapland Chamber Orchestra, as well as her first UK appearance with the Royal Northern Sinfonia.

		Further engagements take her to the symphony orchestras of Malmö and Aalborg, the Nordwestdeutsche Philharmonie Herford, the Jena Philharmonic, the Janáček Philharmonic Ostrava and the Zuger Sinfonietta. She also appears in a variety of family concert formats with the Orchestre de Chambre de Paris, Luxembourg Philharmonic, Antwerp Symphony Orchestra and Netherlands Philharmonic Orchestra. In June 2026 she makes her debut with the Copenhagen Philharmonic as part of the Tivoli Summer Classics Festival.

		Izabelė Jankauskaitė has attended numerous masterclasses with conductors including Jaap van Zweden, Kristjan Järvi, Baldur Brönnimann, Paavo Järvi, Leonid Grin and James Lowe. In June 2023 she assisted Michael Tilson Thomas with the Tonhalle-Orchester Zürich. She has worked with Kammerorchester Basel, Argovia Philharmonic, Mozarteumorchester Salzburg, Tonkünstler-Orchester Niederösterreich, MDR-Sinfonieorchester, Staatsorchester Darmstadt, Philharmonisches Orchester Heidelberg, Münchner Symphoniker, Royal Stockholm Philharmonic, Sønderjylland Symphony Orchestra and Gulbenkian Orchestra. Further invitations have taken her to the Orchestre de Chambre de Lausanne, Folkwang Kammerorchester Essen, Orquesta de Extremadura, Athens State Orchestra and Filarmonica Banatul Timișoara. In autumn 2023 she assisted Nicholas Carter in a production of Puccini’s Tosca at the Stadttheater Bern.

		Izabelė Jankauskaitė was born in Vilnius, Lithuania. She received her first musical training at the National M. K. Čiurlionis School of Art, later studying voice at the Lithuanian Academy of Music and Theatre. She continued her studies at the Zurich University of the Arts, initially specialising in choral conducting, and later in orchestral conducting with Professors Johannes Schlaefli and Christoph-Mathias Mueller.`

	const paragraphs = bio
		.split('\n')
		.map((p) => p.trim())
		.filter(Boolean)
</script>

<section id="biography" class="flex flex-col px-6 pb-32 pt-20 md:block lg:pt-32 xl:flex xl:flex-row-reverse xl:px-0">
	<div class="mx-auto px-6 py-[3.75rem] md:float-right md:w-1/2 md:pl-[4.5rem] md:pr-0 xl:float-none xl:px-32">
		<img
			class="ml-auto max-h-[75vh] max-w-full xl:sticky xl:top-[100px] 2xl:static"
			src="/images/biography.webp"
			alt="Portrait - Izabelė Jankauskaitė"
		/>
	</div>
	<div class="inline leading-loose xl:w-1/2 xl:px-12">
		<h1 class="mb-5 text-2xl sm:text-3xl">Biography</h1>
		{#each paragraphs as paragraph}
			<p>{paragraph}</p>
		{/each}
	</div>
</section>

<style lang="postcss">
	p:not(:last-child) {
		@apply mb-4;
	}
</style>
