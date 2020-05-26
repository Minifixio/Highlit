export interface ErrorTemplate {
    name: string;
    message: string;
    level: number;
}

export const Errors = {
    DEMOS: {
        wrong_parsing: {
            name: 'WRONG_PARSING',
            message: 'Wrong parsing',
            level: 1
        },
        wrong_buffer: {
            name: 'WRONG_BUFFER',
            message: 'Wrong buffer',
            level: 2
        },
        dem_files_not_deleted: {
            name: 'DEM_FILES_NOT_DELETED',
            message: 'The dem files were not deleted',
            level: 3
        },
        extract_dem_files: {
            name: 'EXTRACT_DEM_FILES',
            message: 'Impossible to get extract comments',
            level: 1
        },
        get_twitch_comment: {
            name: 'CANT_GET_TWITCH_COMMENT',
            message: 'Impossible to get Twitch comments',
            level: 1
        },
        download_dem_files: {
            name: 'DOWNLOAD_DEM_FILES',
            message: 'Impossible to get download dem files',
            level: 3
        },
        dem_folder_not_deleted: {
            name: 'DEM_FOLDER_NOT_DELETED',
            message: 'The dem folder was not deleted',
            level: 1
        },
        no_demos: {
            name: 'NO_DEMOS',
            message: 'No demos found',
            level: 2
        },
        no_twitch_stream: {
            name: 'NO_TWITCH_STREAM',
            message: 'No twitch streams for this map',
            level: 2
        },
        make_match_json: {
            name: 'MAKE_MATCH_JSON',
            message: 'Unable to make the match JSON file',
            level: 3
        },
        make_twitch_json: {
            name: 'MAKE_TWITCH_JSON',
            message: 'Unable to make the Twitch JSON file',
            level: 3
        },
        create_match_path: {
            name: 'CREATE_MATCH_PATH',
            message: 'Unable to create the match path',
            level: 3
        }
    },

    HLTV: {
        no_demoid: {
            name: 'NO_DEMOID',
            message: 'The match has no demoID',
            level: 3
        },
        no_streams: {
            name: 'NO_STREAMS',
            message: 'The match has no streams',
            level: 3
        },
        no_demos: {
            name: 'NO_DEMOS',
            message: 'The match has no demos',
            level: 3
        },
        no_teams: {
            name: 'NO_TEAMS',
            message: 'The match has no team infos',
            level: 3
        },
        no_maps: {
            name: 'NO_MAPS',
            message: 'The match has no maps infos',
            level: 3
        },
        invalid_match: {
            name: 'INVALID_MATCH',
            message: 'The match from HLTV is invalid',
            level: 2
        }
    }
}