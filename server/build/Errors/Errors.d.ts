export interface ErrorTemplate {
    name: string;
    message: string;
    level: number;
}
export declare const Errors: {
    DEMOS: {
        wrong_parsing: {
            name: string;
            message: string;
            level: number;
        };
        wrong_buffer: {
            name: string;
            message: string;
            level: number;
        };
        dem_files_not_deleted: {
            name: string;
            message: string;
            level: number;
        };
        extract_dem_files: {
            name: string;
            message: string;
            level: number;
        };
        get_twitch_comment: {
            name: string;
            message: string;
            level: number;
        };
        download_dem_files: {
            name: string;
            message: string;
            level: number;
        };
        dem_folder_not_deleted: {
            name: string;
            message: string;
            level: number;
        };
        no_demos: {
            name: string;
            message: string;
            level: number;
        };
        no_twitch_stream: {
            name: string;
            message: string;
            level: number;
        };
        make_match_json: {
            name: string;
            message: string;
            level: number;
        };
        make_twitch_json: {
            name: string;
            message: string;
            level: number;
        };
        create_match_path: {
            name: string;
            message: string;
            level: number;
        };
        find_map_infos: {
            name: string;
            message: string;
            level: number;
        };
    };
    HLTV: {
        no_demoid: {
            name: string;
            message: string;
            level: number;
        };
        no_streams: {
            name: string;
            message: string;
            level: number;
        };
        no_demos: {
            name: string;
            message: string;
            level: number;
        };
        no_teams: {
            name: string;
            message: string;
            level: number;
        };
        no_maps: {
            name: string;
            message: string;
            level: number;
        };
        invalid_match: {
            name: string;
            message: string;
            level: number;
        };
    };
    MAIL: {
        wrong_twitch_stream: {
            name: string;
            message: string;
            level: number;
        };
        incorrect_round_timings: {
            name: string;
            message: string;
            level: number;
        };
        wrong_multikills: {
            name: string;
            message: string;
            level: number;
        };
        other: {
            name: string;
            message: string;
            level: number;
        };
    };
};
