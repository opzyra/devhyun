import express from 'express';

import validator, { Joi } from '../../lib/validator';
import sessionCtx from '../../lib/session';
import oauth, { loginUrl } from '../../lib/oauth';

import { txrtfn } from '../../core/tx';

import Member from '../../sql/Member';

const router = express.Router();

router.get('/login', sessionCtx.isAnonymous(), (req, res) => {
  res.render('client/login', { loginUrl, layout: false });
});

router.get(
  '/login/:platform',
  sessionCtx.isAnonymous(),
  validator.query({
    code: Joi.string().required(),
  }),
  validator.params({
    platform: Joi.string().required(),
  }),
  txrtfn(async (req, res, next, conn) => {
    const { platform } = req.params;
    const { code } = req.query;

    const MEMBER = Member(conn);

    const auth = oauth[platform];

    if (!auth) {
      throw new Error('platform error');
    }

    const member = await auth(code);

    const dbMember = await MEMBER.selectById(member.id);

    if (!dbMember) {
      await MEMBER.insertOne(member);
    } else {
      await MEMBER.updateOne({ ...member, login: new Date() }, dbMember.idx);
    }

    const sessionMember = await MEMBER.selectById(member.id);

    if (!sessionMember.active) {
      res.redirect('/login?error=active');
      return;
    }

    if (sessionMember.withdraw) {
      res.redirect('/login?error=withdraw');
      return;
    }

    req.session.member = sessionMember;

    const redirect = req.cookies.redirect || '/';
    res.clearCookie('redirect');

    res.redirect(redirect);
  }),
);

export default router;
