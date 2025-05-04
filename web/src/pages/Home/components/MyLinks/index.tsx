import React from 'react';

import {
  DownloadSimple,
  LinkBreak,
  Link as LinkIcon,
} from '@phosphor-icons/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Button } from '@/components/Button';
import { api } from '@/service/api';
import { Spinner } from '@/components/Spinner';
import { Link } from '@/pages/Home/components/MyLinks/Link';
import { EmptyState } from '@/components/EmptyState';

const PAGE_SIZE = 20;

type ShortenedLinkInfo = {
  id: string;
  originalLink: string;
  shortenedLink: string;
  quantityAccesses: number;
  createdAt: string;
};

type ShortenedLinkList = {
  total: number;
  page: number;
  pageSize: number;
  data: ShortenedLinkInfo[];
};

export const MyLinks: React.FC = () => {
  const {
    data: listOfLinks,
    isError: listOfLinksIsError,
    isFetching: listOfLinksIsFetching,
    isRefetching: listOfLinksIsRefetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery<ShortenedLinkList>({
    queryKey: ['links list'],
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get(
        `/shortened-links?page=${pageParam}&pageSize=${PAGE_SIZE}`,
      );

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.total > allPages.length * PAGE_SIZE) {
        return lastPage.page + 1;
      }

      return undefined;
    },
  });

  const onScroll = (event: React.UIEvent<HTMLDivElement>): void => {
    const { scrollHeight, scrollTop, clientHeight } = event.currentTarget;

    const distanceFromScrollToEnd = scrollHeight - scrollTop - clientHeight;
    const scrollIsMiddle = distanceFromScrollToEnd <= clientHeight / 2;

    if (scrollIsMiddle && hasNextPage && !listOfLinksIsFetching) {
      fetchNextPage();
    }
  };

  const quantityOfLinks = (listOfLinks && listOfLinks.pages[0].total) ?? 0;
  const listOfLinksIsEmpty = quantityOfLinks === 0;

  return (
    <div className="relative max-w-190 w-full md:max-w-290 md:min-w-190 h-fit flex flex-col flex-1 gap-8 md:gap-10 bg-gray-100 rounded-lg p-12 md:p-16">
      {listOfLinksIsRefetching && (
        <div className="absolute top-0 left-0 h-1 w-full animate-border bg-size-[100px_auto] md:bg-size-[200px_auto] bg-no-repeat bg-gradient-to-r from-blue-base to-blue-base" />
      )}

      <div className="flex flex-row items-center justify-between">
        <h2 className="text-lg text-gray-600">Meus links</h2>

        <Button variant="secondary" icon={DownloadSimple} disabled>
          Baixar CSV
        </Button>
      </div>

      <div className="border-t border-gray-200">
        {listOfLinksIsError ? (
          <EmptyState
            icon={<LinkBreak size="2rem" color="var(--color-danger)" />}
            description="Erro ao carregar os links cadastrados"
            data-testid="container-link-list-error"
          />
        ) : !listOfLinks ? (
          <EmptyState
            icon={<Spinner />}
            description="Carregando..."
            data-testid="container-link-list-loading"
          />
        ) : listOfLinksIsEmpty ? (
          <EmptyState
            icon={<LinkIcon size="2rem" color="var(--color-gray-400)" />}
            description="Ainda não existem links cadastrados"
            data-testid="container-link-list-empty"
          />
        ) : (
          <ScrollArea.Root type="auto" className="w-full">
            <ScrollArea.Viewport
              onScroll={onScroll}
              className="overflow-hidden"
              style={{
                maxHeight: 'calc(100vh - 19rem)',
                minHeight: quantityOfLinks < 4 ? 'fit-content' : '14.125rem',
              }}
              data-testid="container-my-links-scroll"
            >
              <div className="md:w-full flex flex-col gap-3 md:gap-4">
                {listOfLinks.pages.map(({ page, data }) =>
                  data.map((link, index) => {
                    const isFirstLink = index === 0 && page === 1;

                    return (
                      <Link
                        key={link.id}
                        isFirstLink={isFirstLink}
                        info={link}
                      />
                    );
                  }),
                )}

                {hasNextPage && <Link isFirstLink={false} isLoading />}
              </div>
            </ScrollArea.Viewport>

            <ScrollArea.Scrollbar
              orientation="vertical"
              className="flex w-4 mr-[-0.875rem] bg-gray-200 rounded-full transition-colors duration-150 ease-out"
            >
              <ScrollArea.Thumb className="flex-1 rounded-full bg-blue-base hover:bg-blue-dark" />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        )}
      </div>
    </div>
  );
};
