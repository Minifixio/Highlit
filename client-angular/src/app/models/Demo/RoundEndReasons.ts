import { RoundEndReason } from './RoundEndReason';

export const RoundEndReasons = new Map();

RoundEndReasons.set(1, new RoundEndReason(1, 'bomb_exploded'));
RoundEndReasons.set(7, new RoundEndReason(7, 'bomb_defused'));
RoundEndReasons.set(8, new RoundEndReason(8, 'elimination_ct'));
RoundEndReasons.set(9, new RoundEndReason(9, 'elimination_t'));
RoundEndReasons.set(12, new RoundEndReason(12, 'time_out'));
