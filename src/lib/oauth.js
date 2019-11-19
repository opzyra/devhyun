import axios from "axios";
import qs from "qs";

const github = async code => {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      code,
      client_id: process.env.OAUTH_GITHUB_ID,
      client_secret: process.env.OAUTH_GITHUB_SECRET
    },
    {
      headers: {
        accept: "application/json"
      }
    }
  );

  const token = response.data.access_token;

  const { data } = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `token ${token}`
    }
  });

  const name = data => {
    if (!data.name || data.name === "") {
      return data.login;
    }
    return data.name;
  };

  return {
    id: `GIT_${data.id}`,
    name: name(data),
    thumbnail: data.avatar_url
  };
};

const google = async code => {
  const response = await axios.post(
    "https://www.googleapis.com/oauth2/v4/token",
    qs.stringify({
      code,
      client_id: process.env.OAUTH_GOOGLE_ID,
      client_secret: process.env.OAUTH_GOOGLE_SECRET,
      redirect_uri: process.env.OAUTH_GOOGLE_CALLBACK,
      grant_type: "authorization_code"
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
      }
    }
  );

  const token = response.data.access_token;

  const { data } = await axios.get(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return {
    id: `GOOGLE_${data.id}`,
    name: data.name,
    thumbnail: data.picture
  };
};

const facebook = async code => {
  const response = await axios.post(
    "https://graph.facebook.com/v5.0/oauth/access_token",
    {
      code,
      client_id: process.env.OAUTH_FACEBOOK_ID,
      client_secret: process.env.OAUTH_FACEBOOK_SECRET,
      redirect_uri: process.env.OAUTH_FACEBOOK_CALLBACK
    },
    {
      headers: {
        accept: "application/json"
      }
    }
  );

  const token = response.data.access_token;

  const { data } = await axios.get(
    `https://graph.facebook.com/v5.0/me?fields=id%2Cname%2Cpicture&access_token=${token}`
  );

  return {
    id: `FACEBOOK_${data.id}`,
    name: data.name,
    thumbnail: data.picture.data.url
  };
};

export const loginUrl = {
  github: `https://github.com/login/oauth/authorize?client_id=${process.env.OAUTH_GITHUB_ID}&redirect_uri=${process.env.OAUTH_GITHUB_CALLBACK}`,
  google: `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.OAUTH_GOOGLE_ID}&redirect_uri=${process.env.OAUTH_GOOGLE_CALLBACK}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/plus.me+https://www.googleapis.com/auth/userinfo.profile`,
  facebook: `https://www.facebook.com/v5.0/dialog/oauth?client_id=${process.env.OAUTH_FACEBOOK_ID}&redirect_uri=${process.env.OAUTH_FACEBOOK_CALLBACK}`
};

export default {
  github,
  google,
  facebook
};
