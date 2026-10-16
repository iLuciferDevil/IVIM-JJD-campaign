const crypto=require('crypto');
module.exports=async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const secret=process.env.IVIM_JJD_DASHBOARD_PASSWORD;
  if(!secret)return res.status(503).json({error:'Dashboard access is not configured'});
  const provided=typeof req.body?.password==='string'?req.body.password:'';
  const a=Buffer.from(provided),b=Buffer.from(secret);
  if(a.length!==b.length || !crypto.timingSafeEqual(a,b))return res.status(401).json({error:'Incorrect password'});
  const expires=String(Date.now()+12*60*60*1000);
  const signature=crypto.createHmac('sha256',secret).update('ivim-jjd-session-v1:'+expires).digest('hex');
  res.setHeader('Set-Cookie','ivim_jjd_session='+expires+'.'+signature+'; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200');
  return res.status(200).json({ok:true});
};