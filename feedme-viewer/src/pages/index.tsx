import { GetServerSidePropsResult } from "next";
import Head from "next/head";
import { useState } from "react";
import { FancyTitle } from "~/components/FancyTitle";

import { MarketList } from "~/components/MarketView";
import { Refresh } from "~/components/Refresh";
import { Wrapper, WrapperProps } from "~/components/Wrapper";
import { getLeftSideMenuItems } from "~/helper/leftSideMenuHelper";
import { stripPipeEscapes } from "~/helper/stringHelper";
import { title } from "~/helper/title";
import { EventView, MarketView, mongoService } from "~/service/MongoService";

const RANDOM_MARKET_COUNT = 2;

interface HomeProps extends WrapperProps {
    randomMarkets: Array<[EventView, MarketView[]]>;
}

export async function getServerSideProps(): Promise<GetServerSidePropsResult<HomeProps>> {
    const [leftSideMenuItems, randomMarkets] = await Promise.all([
        getLeftSideMenuItems(),
        (await mongoService).getRandomMarkets(RANDOM_MARKET_COUNT),
    ]);

    return { props: { leftSideMenuItems, randomMarkets } };
}

export default function Home({ leftSideMenuItems, randomMarkets }: HomeProps) {
    const [marketsData, setMarketsData] = useState(randomMarkets);

    const refresh = async () => {
        const response = await fetch(`/api/v1/event/random?limit=${RANDOM_MARKET_COUNT}`);

        if (response.ok) {
            setMarketsData(await response.json());
        } else {
            console.error(await response.text());
        }
    };

    return (
        <>
            <Head>
                <title>{ title("Home") }</title>
            </Head>
            <Wrapper leftSideMenuItems={ leftSideMenuItems }>
                <FancyTitle>Your Random Picks</FancyTitle>
                <Refresh onClick={ refresh }>New Random Markets</Refresh>
                { marketsData.map(([event, markets]) => (
                    <section key={ event.eventId }>
                        <h2>{ stripPipeEscapes(event.name) }</h2>
                        <h3>{ event.category }</h3>
                        <MarketList marketsData={ markets } />
                    </section>
                )) }
            </Wrapper>
        </>
    );
}
