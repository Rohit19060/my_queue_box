import { render } from '@testing-library/svelte';
import { describe, it, expect } from 'vitest';
import Home from './Home.svelte';
import Read from './Read.svelte';
import Watch from './Watch.svelte';
import BookmarkCard from './home/BookmarkCard.svelte';
import Button from './home/Button.svelte';
import CountAnalytics from './home/CountAnalytics.svelte';
import VideoCard from './home/VideoCard.svelte';
import Navbar from './home/Navbar.svelte';
import SearchVideoForm from './watch/SearchVideoForm.svelte';
import UploadJsonFile from './watch/UploadJsonFile.svelte';
import VideosGrid from './watch/VideosGrid.svelte';
import VideosSearch from './watch/VideosSearch.svelte';
import SearchedVideoDetails from './watch/SearchedVideoDetails.svelte';
import YouTubePlaylistModal from './watch/YouTubePlaylistModal.svelte';

describe('Components', () => {
  it('should render Home component', () => {
    const { container } = render(Home);
    expect(container).toBeTruthy();
  });

  it('should render Read component', () => {
    const { container } = render(Read);
    expect(container).toBeTruthy();
  });

  it('should render Watch component', () => {
    const { container } = render(Watch);
    expect(container).toBeTruthy();
  });

  it('should render BookmarkCard component', () => {
    const { container } = render(BookmarkCard, {
      props: {
        title: 'Test Title',
        description: 'Test Description',
        timeAgo: '1 day ago'
      }
    });
    expect(container).toBeTruthy();
  });

  it('should render Button component', () => {
    const { container } = render(Button, {
      props: {
        label: 'Test Button'
      }
    });
    expect(container).toBeTruthy();
  });

  it('should render CountAnalytics component', () => {
    const { container } = render(CountAnalytics, {
      props: {
        totalCount: 100,
        pendingCount: 50,
        label: 'Test Label',
        undoneLabel: 'Test Undone Label'
      }
    });
    expect(container).toBeTruthy();
  });

  it('should render VideoCard component', () => {
    const { container } = render(VideoCard, {
      props: {
        title: 'Test Title',
        description: 'Test Description',
        timeAgo: '1 day ago'
      }
    });
    expect(container).toBeTruthy();
  });

  it('should render Navbar component', () => {
    const { container } = render(Navbar);
    expect(container).toBeTruthy();
  });

  it('should render SearchVideoForm component', () => {
    const { container } = render(SearchVideoForm);
    expect(container).toBeTruthy();
  });

  it('should render UploadJsonFile component', () => {
    const { container } = render(UploadJsonFile);
    expect(container).toBeTruthy();
  });

  it('should render VideosGrid component', () => {
    const { container } = render(VideosGrid);
    expect(container).toBeTruthy();
  });

  it('should render VideosSearch component', () => {
    const { container } = render(VideosSearch);
    expect(container).toBeTruthy();
  });

  it('should render SearchedVideoDetails component', () => {
    const { container } = render(SearchedVideoDetails, {
      props: {
        videoDetails: {
          id: 'test-id',
          title: 'Test Title',
          description: 'Test Description',
          duration: 'PT1H2M3S',
          channelTitle: 'Test Channel',
          channelId: 'test-channel-id',
          categoryId: 'test-category-id',
          tags: ['test', 'tags'],
          publishedAt: '2023-01-01T00:00:00Z'
        }
      }
    });
    expect(container).toBeTruthy();
  });

  it('should render YouTubePlaylistModal component', () => {
    const { container } = render(YouTubePlaylistModal);
    expect(container).toBeTruthy();
  });
});
