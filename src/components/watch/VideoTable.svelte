<script lang="ts">
	import { dateToHumanReadable, secondsToHumanReadable } from '$lib';

	export let data: VideoIndexDB[] = [];
	export let onclick = (str: string) => console.log(str);
	export let onSearch = (str: string) => console.log(str);
</script>

<div class="overflow-hidden rounded-lg">
	<div class="flex items-center gap-4 p-4 bg-background">
		<input
			class="flex flex-1 w-full h-10 px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ring-orange-400"
			placeholder="Search videos..."
			type="search"
			on:change={(e) => onSearch((e.target as HTMLInputElement).value || '')}
		/>
	</div>
	<div class="relative w-full overflow-auto">
		<table class="w-full text-sm caption-bottom">
			<thead class="[&amp;_tr]:border-b">
				<tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
					<th
						class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 w-[80px]"
					>
						<span class="sr-only">Thumbnail</span>
					</th>
					<th
						class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 cursor-pointer"
						on:click={() => onclick('titleIndex')}
					>
						Title
					</th>
					<th
						class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 cursor-pointer"
						on:click={() => onclick('durationIndex')}
					>
						Duration
					</th>
					<th
						class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 cursor-pointer"
						on:click={() => onclick('channelIndex')}
					>
						Channel
					</th>
					<th
						class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 cursor-pointer"
						on:click={() => onclick('publishedAtIndex')}
					>
						Published
					</th>
				</tr>
			</thead>
			<tbody class="[&amp;_tr:last-child]:border-0">
				{#each data as item, i}
					<tr
						class="border-b transition-colors data-[state=selected]:bg-muted group cursor-pointer hover:bg-muted"
					>
						<td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
							<img
								src="https://i.ytimg.com/vi/{item.id}/mqdefault.jpg"
								alt={item.title}
								width="133"
								height="100"
								class="object-cover rounded-md"
								style="aspect-ratio: 133 / 100; object-fit: cover;"
							/>
						</td>
						<td>
							<a
								href={`https://www.youtube.com/watch?v=${item.id}`}
								target="_blank"
								rel="noopener noreferrer"
								class="flex-grow font-bold text-center rounded-2xl"
							>
								<h4>{item.title}</h4>
							</a>
						</td>
						<td>{secondsToHumanReadable(item.durationSec)}s</td>

						<td>
							<a
								href={`https://www.youtube.com/channel/${item.channelId}`}
								rel="noopener noreferrer"
								target="_blank"
							>
								{item.channelTitle}</a
							>
						</td>
						<td>{dateToHumanReadable(item.publishedAt)}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
