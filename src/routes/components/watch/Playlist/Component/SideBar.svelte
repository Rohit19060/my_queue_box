<script lang="ts">
	import { extractYouTubeId, searchYouTubeAPI, YouTubeIdType } from '$lib';
	import { onMount } from 'svelte';
	import Button from '../../../Common/Button.svelte';
	import TrashIcon from '../../../Svgs/TrashIcon.svelte';
	import {
		fetchPlaylistData,
		PLAYLIST_STORE,
		removePlaylistFromIndexDB,
		SIDEBAR_OPEN,
		storePlaylistInIndexedDB
	} from '../Store/PlayListStore';
	import { IS_PLAYLIST_MODAL_TYPE } from '$lib/stores/VideoDB';

	let newPlaylistName: string = '';
	let isLoading = {
		id: '-1',
		state: false,
		type: ''
	};

	async function addPlaylist(): Promise<void> {
		if (isLoading.state || newPlaylistName.trim() === '') {
			return;
		}
		const extractedData = extractYouTubeId(newPlaylistName);
		if (extractedData.type !== YouTubeIdType.Playlist) {
			newPlaylistName = '';
			alert('Please enter a valid YouTube Playlist URL.');
			return;
		}
		let alreadyExists = false;
		for (let i = 0; i < $PLAYLIST_STORE.length; i++) {
			if ($PLAYLIST_STORE[i].id === extractedData.id) {
				alreadyExists = true;
				break;
			}
		}
		if (alreadyExists) {
			newPlaylistName = '';
			alert('This playlist already exists in your collection.');
			return;
		}
		isLoading = {
			id: '0',
			state: true,
			type: 'add'
		};
		try {
			const response = await fetch(
				`/api/youtube?playlistDetails=${encodeURIComponent(extractedData.id)}`
			);
			const res = await response.json();
			if (!response.ok) {
				throw new Error(res.error);
			}
			const playlistDetails = res as App.Playlist;
			const playlist = {
				id: playlistDetails.id,
				name: playlistDetails.snippet.title
			} as App.PlaylistIndexDB;
			await storePlaylistInIndexedDB(playlist);
			$PLAYLIST_STORE = [...$PLAYLIST_STORE, playlist];
			$PLAYLIST_STORE.sort((a, b) => a.name.localeCompare(b.name));
			newPlaylistName = '';
		} catch (e) {
			alert('Error adding playlist to indexDB');
			console.error('Error adding playlist to indexDB', e);
			return;
		} finally {
			isLoading = {
				id: '-1',
				state: false,
				type: ''
			};
		}
	}

	async function removePlaylist(id: string): Promise<void> {
		if (isLoading.state || isLoading.id === id) {
			return;
		}
		isLoading = {
			id: id,
			state: true,
			type: 'remove'
		};
		try {
			await removePlaylistFromIndexDB(id);
			$PLAYLIST_STORE = $PLAYLIST_STORE.filter((playlist) => playlist.id !== id);
		} catch (e) {
			console.error('Error removing playlist to indexDB', e);
			return;
		} finally {
			isLoading = {
				id: '-1',
				state: false,
				type: ''
			};
		}
	}

	async function showPlayListDetails(playlist: App.PlaylistIndexDB): Promise<void> {
		if (isLoading.state || isLoading.id === playlist.id) {
			return;
		}
		try {
			isLoading = {
				id: playlist.id,
				state: true,
				type: 'show'
			};
			const x = await searchYouTubeAPI(playlist.id);
			if (x === YouTubeIdType.Playlist) {
				IS_PLAYLIST_MODAL_TYPE.set('PLAYLIST');
			}

			SIDEBAR_OPEN.set(false);
		} catch (e) {
			console.error('Error fetching playlist details', e);
		} finally {
			isLoading = {
				id: '-1',
				state: false,
				type: ''
			};
		}
	}

	onMount(async () => {
		const { results } = await fetchPlaylistData();
		if (results.length !== 0) {
			$PLAYLIST_STORE = results;
			$PLAYLIST_STORE.sort((a, b) => a.name.localeCompare(b.name));
		}
	});
</script>

{#if $SIDEBAR_OPEN}
	<div class="fixed top-0 left-0 z-50 flex flex-col p-4 bg-white shadow-lg w-80 h-dvh">
		<div class="flex items-center justify-between">
			<h2 class="mb-4 text-xl font-bold">Playlists</h2>
			<button class="ml-5" on:click={() => SIDEBAR_OPEN.set(!$SIDEBAR_OPEN)}> X </button>
		</div>
		<form on:submit|preventDefault={addPlaylist} class="mb-4">
			<div class="flex items-center justify-center space-x-2">
				<input
					class="w-full h-10 p-2 border border-gray-300 max-w-80 focus:outline-none focus:border-black focus:border-opacity-75"
					placeholder="Enter a YouTube Playlist Url"
					type="url"
					id="youTubeVideo"
					bind:value={newPlaylistName}
					required
				/>
				<div class="flex items-center justify-center w-24">
					{#if isLoading.id == '0' && isLoading.state}
						<div class="loader" />
					{:else}
						<Button label="Add" type="submit" />
					{/if}
				</div>
			</div>
		</form>

		<!-- Playlist Items -->
		<div class="flex-grow overflow-y-auto">
			{#each $PLAYLIST_STORE as playlist}
				<div
					class="flex items-center justify-between p-2 mb-2 transition-transform duration-300 ease-in-out bg-white rounded shadow"
				>
					<a href="https://www.youtube.com/playlist?list={playlist.id}" target="_blank">
						<span class="flex-grow truncate">{playlist.name}</span></a
					>
					<div class="flex space-x-1">
						<button
							on:click={() => showPlayListDetails(playlist)}
							title="Reload playlist"
							class="p-1 text-gray-600 hover:text-blue-500"
						>
							{#if isLoading.id == playlist.id && isLoading.state && isLoading.type == 'show'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-4 h-4 rotate"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								>
									<path
										d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="w-4 h-4"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
									/>
								</svg>
							{/if}
						</button>

						<button on:click={() => removePlaylist(playlist.id)} title="Remove playlist">
							<div
								class="  {isLoading.id == playlist.id &&
								isLoading.state &&
								isLoading.type == 'remove'
									? 'rotate'
									: ''}"
							>
								<TrashIcon />
							</div>
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	/* Define the keyframe for rotation */
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	/* Apply the animation class */
	.rotate {
		animation: rotate 1s linear infinite;
	}
</style>
