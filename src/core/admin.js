import sessionCtx from './session';

const log = async (req, mapper, contents) => {
  const member = req.session.member;

  // 최고관리자의 경우 로그를 기록하지 않는다.
  if (member.role.includes('SUPER_ADMIN')) return;

  try {
    let ip = sessionCtx.getClientIp(req);
    let param = {
      device: sessionCtx.getClientDevice(req),
      ip,
      id: member.id,
      name: member.name,
      role: member.role,
      contents,
    };

    await mapper('ActivityLog', 'insertOne', param);
  } catch (error) {
    throw new Error(error);
  }
};

const access = async (req, mapper, contents) => {
  const member = req.session.member;

  // 최고관리자와 일반 유저의 경우 기록하지 않는다.
  if (member.role.includes('SUPER_ADMIN') || member.role.includes('USER'))
    return;

  try {
    let ip = sessionCtx.getClientIp(req);
    let param = {
      device: sessionCtx.getClientDevice(req),
      ip,
      id: member.id,
      name: member.name,
      role: member.role,
      contents,
    };

    await mapper('ActivityLog', 'insertOne', param);
  } catch (error) {
    throw new Error(error);
  }
};

export default { log, access };
