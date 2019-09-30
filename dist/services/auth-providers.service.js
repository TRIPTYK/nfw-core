"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable camelcase */
const axios_1 = require("axios");
const facebook = async (access_token, refreshToken, profile) => {
    const fields = 'id,name,first_name,last_name,email,picture';
    const url = 'https://graph.facebook.com/me';
    const params = { access_token, fields };
    const response = await axios_1.default.get(url, { params });
    const { id, name, email, picture, first_name, last_name } = response.data;
    return {
        service: 'facebook',
        picture: picture.data.url,
        id,
        name,
        first_name,
        last_name,
        email,
    };
};
exports.facebook = facebook;
const google = async (access_token) => {
    const url = 'https://www.googleapis.com/oauth2/v3/userinfo';
    const params = { access_token };
    const response = await axios_1.default.get(url, { params });
    const { sub, name, email, picture, given_name, family_name } = response.data;
    return {
        service: 'google',
        picture,
        id: sub,
        first_name: given_name,
        last_name: family_name,
        name,
        email,
    };
};
exports.google = google;
