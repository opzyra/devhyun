import asyncify from '@/lib/asyncify';
import session from '@/lib/session';

import validator, { Joi } from '@/middleware/validator';

import Member from '@/models/Member';

const controller = asyncify();

export const logout = controller.post(
  '/logout', // 로그아웃
  session.isAuthenticated(), // 로그인 권한
  (req, res) => {
    req.session.member = null;
    res.status(200).json({ message: '로그아웃 되었습니다' });
  },
);

export const email = controller.post(
  '/email',
  session.isAuthenticated(),
  validator.body({
    email: Joi.string()
      .email()
      .required(),
  }),
  async (req, res, transaction) => {
    const { email } = req.body;
    const member = req.session.member;

    await Member.updateOne({ email }, member.idx)(transaction);

    req.session.member = { ...member, email };

    res.status(200).json({ message: `이메일 정보가 변경되었습니다` });
  },
);

export const marketing = controller.post(
  '/marketing',
  session.isAuthenticated(),
  validator.body({
    marketing: Joi.boolean().required(),
  }),
  async (req, res, transaction) => {
    const { marketing } = req.body;
    const member = req.session.member;

    await Member.updateOne({ marketing }, member.idx)(transaction);

    req.session.member = { ...member, marketing };

    res.status(200).json({ message: `마케팅 수신 동의가 변경되었습니다` });
  },
);

export const active = controller.put(
  '/active/:idx',
  session.isAdmin(),
  validator.params({
    idx: Joi.number().required(),
  }),
  validator.body({
    active: Joi.boolean().required(),
  }),
  async (req, res, transaction) => {
    const { idx } = req.params;
    const { active } = req.body;

    await Member.updateOne({ active }, idx)(transaction);

    res.status(200).json({ message: `활성화 정보가 변경되었습니다` });
  },
);

export const withdraw = controller.delete(
  '/',
  session.isAuthenticated(),
  async (req, res, transaction) => {
    const member = req.session.member;

    await Member.updateOne({ withdraw: true }, member.idx)(transaction);

    req.session.member = null;

    res.status(200).json({
      message: `탈퇴가 완료되었습니다<br>데브현을 이용해주셔서 감사합니다`,
    });
  },
);

export default controller.router;
