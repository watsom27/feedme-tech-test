import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useState } from "react";

import { FancyTitle } from "~/components/FancyTitle";
import { MarketList } from "~/components/MarketView";
import { Refresh } from "~/components/Refresh";
import { Wrapper, WrapperProps } from "~/components/Wrapper";
import { getLeftSideMenuItems } from "~/helper/leftSideMenuHelper";
import { stripPipeEscapes } from "~/helper/stringHelper";
import { EventView, MarketView, mongoService } from "~/service/MongoService";

interface EventProps extends WrapperProps {
    event: EventView;
    markets: MarketView[];
}

export async function getServerSideProps(
    context: GetServerSidePropsContext,
): Promise<GetServerSidePropsResult<EventProps>> {
    const eventId = context.query.id;
    let result: GetServerSidePropsResult<EventProps> = { notFound: true };

    if (eventId && !Array.isArray(eventId)) {
        const ms = await mongoService;

        const [leftSideMenuItems, markets, event] = await Promise.all([
            getLeftSideMenuItems(),
            ms.getMarketsForEvent(eventId),
            ms.getEventById(eventId),
        ]);

        if (markets && event) {
            result = {
                props: {
                    leftSideMenuItems,
                    event,
                    markets,
                },
            };
        }
    }

    return result;
}

export default function eventPage({ leftSideMenuItems, event, markets }: EventProps): JSX.Element {
    const [marketsData, setMarketsData] = useState(markets);

    const refresh = async () => {
        const response = await fetch(`/api/v1/event/${event.eventId}`);

        if (response.ok) {
            setMarketsData(await response.json());
        } else {
            console.error(await response.text());
        }
    };

    return (
        <Wrapper leftSideMenuItems={ leftSideMenuItems }>
            <FancyTitle>{ stripPipeEscapes(event.name) }</FancyTitle>
            <Refresh onClick={ refresh } />
            <MarketList marketsData={ marketsData } open />
        </Wrapper>
    );
}
