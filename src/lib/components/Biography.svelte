<script lang="ts">
	const bio: string = `
		The 26-year-old Lithuanian conductor Izabelė Jankauskaitė first attracted international attention in 2022 when she won the Neeme Järvi Prize at the renowned Gstaad Conducting Academy. In the 2024/25 season, she assumes the role of Assistant Conductor of the hr-Sinfonieorchester. From August 2022 to June 2023 she held the same position at the Tonhalle-Orchester Zürich under Paavo Järvi.
		In her new role in Frankfurt this season she will assist Alain Altinoglu, while also taking to the podium herself for multiple projects, such as the orchestra’s traditional New Year’s concert in Wiesbaden. In September 2024, she conducts Schubert’s first symphony in a concert with the Mozarteumorchester Salzburg. She also gives debuts with the MDR-Sinfonieorchester, Staatsorchester Darmstadt, Heidelberger Philharmoniker, Tonkünstler-Orchester Niederösterreich, Argovia Philharmonic, and Sønderjylland Symphony Orchestra. In January 2025, she returns to the Tonhalle-Orchester Zürich for a family concert. She will also lead an Education Project with the Royal Stockholm Philharmonic and appears with two different programmes with the Kammerorchester Basel in Switzerland and Budapest.
		Izabelė Jankauskaitė has attended numerous master classes with conductors such as Jaap van Zweden, Kristjan Järvi, Baldur Brönnimann, Paavo Järvi, Leonid Grin, and James Lowe. In June 2023, she assisted Michael Tilson Thomas with the Tonhalle-Orchester Zürich. She has also worked with the Theater Orchester Biel Solothurn, Württembergischen Kammerorchester Heilbronn, Münchner Symphoniker, Musikkollegium Winterthur, and the Berner Symphonieorchester, among others. Further invitations have taken her to the Orchestre de Chambre de Lausanne, Orquesta de Extremadura, Athens State Orchestra, Filarmonica Banatul Timișoara, and to Folkwang Kammerorchester Essen. In autumn 2023, she assisted Nicholas Carter with an opera production of Puccini’s ‘Tosca’ at the Stadttheater Bern.
		In 2017, she won first prize at the Jonas Aleksa Choir Conducting Competition. From 2019 to 2022 she was choir director of the Johannes Choir Mellingen and the Stadtsänger Winterthur.
		Izabelė Jankauskaitė was born in Vilnius, Lithuania. She received her first music lessons at the National M. K. Čiurlionis School of Art and later took up vocal studies at the Lithuanian Academy of Music and Theatre. In 2018, she continued her musical education at the Zurich University of the Arts, initially in choral conducting. In 2020, she switched to orchestral conducting in the class of Prof. Johannes Schlaefli. She is currently studying in Zurich with Johannes Schlaefli and Christoph- Mathias Mueller.
		Choral music had a significant impact on her development as a musician, and its influence is still evident in her nature, reflected in her conducting, expression, and lyricism.
	`
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
		{#each bio.split('\n') as paragraph}
			<p>{paragraph}</p>
		{/each}
	</div>
</section>

<style lang="postcss">
	p:not(:last-child) {
		@apply mb-4;
	}
</style>
