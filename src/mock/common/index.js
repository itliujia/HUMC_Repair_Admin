const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
]

const positions = [
  {
    CN: '平台管理员 | 河南开封科技传媒学院-后勤服务管理中心',
  }
]

const sayings = [
]

const logos = [
]

const admins = ['平台管理员']

const groups = ['吕永飞 [ 教师 ]','','刘佳 [ 20计科（专升本）]','','郭明豪 [ 19大数据 ]','','邝太行 [ 19大数据 ]','','张琼柯 [ 20大数据 ]']

const users = [
  {
    name: '曲丽丽',
    avatar: avatars[0],
    groupId: 0
  },
  {
    name: '付晓晓',
    avatar: avatars[1],
    groupId: 0
  },
  {
    name: '林东东',
    avatar: avatars[2],
    groupId: 1
  },
  {
    name: '周星星',
    avatar: avatars[3],
    groupId: 2
  },
  {
    name: '朱偏右',
    avatar: avatars[4],
    groupId: 3
  },
  {
    name: '勒个',
    avatar: avatars[5],
    groupId: 4
  }
]

const teams = groups.map((item, index) => {
  return {
    name: item,
    avatar: avatars[index]
  }
})

export {logos, sayings, positions, avatars, admins, groups, users, teams}
