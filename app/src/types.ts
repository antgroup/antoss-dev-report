export interface Data {
  /** 开发者的 GitHub ID */
  id: number;
  /** 开发者的 GitHub 用户名 */
  login: string;
  /** 是否为蚂蚁集团员工 */
  isEmployee: boolean;

  /** 2025 年全年参与的 GitHub 仓库数量（有过 Issue 或 PR 参与的仓库数量） */
  participateRepoCount: number;
  /** 2025 年全年参与的蚂蚁集团 GitHub 仓库数量（有过 Issue 或 PR 参与的蚂蚁集团仓库数量，参照 OpenDigger 标签） */
  participateAntRepoCount: number;

  /** 2025 年全年解决的 Bug 数量（全年全域合入的 PR 数量） */
  bugResolvedCount: number;
  /** 2025 年全年参与的 Issue 数量（全年全域开启、关闭或参与评论的 Issue 数量） */
  participateIssueCount: number;

  /** 2025 年全年合入的代码修改行数（新增 + 删除） */
  codeChangedLinesTotal: number;
  /** 2025 年全年合入的代码修改行数（新增） */
  codeChangedLinesAdded: number;
  /** 2025 年全年合入的代码修改行数（删除） */
  codeChangedLinesDeleted: number;

  /** 2025 年全年活跃天数 */
  activeDays: number;
  /** 2025 年全年 OpenRank 总分 */
  totalOpenRank: number;

  /** 2025 年全年贡献等级 */
  level: string;
  /** 2025 年全年贡献等级比例 */
  levelRatio: string;

  /** 历史上参与第一个蚂蚁集团仓库的日期 */
  firstAntRepoDateTime: string;
  /** 历史上参与的第一个蚂蚁集团仓库的名称 */
  firstAntRepoName: string;
  /** 历史上参与第一个蚂蚁集团仓库的行为类型：IssuesEvent，PullRequestEvent，PushEvent, WatchEvent, ForkEvent, IssuesReactionEvent */
  firstAntRepoType: string;
  /**
   * 历史上参与第一个蚂蚁集团仓库的行为动作：
   * - opened         // 开启（如 Issue/PR）
   * - closed         // 关闭（如 Issue/PR）
   * - created        // 创建（如评论/PR/Issue）
   * - added          // 添加（如贡献者）
   * - started        // 标记关注（WatchEvent）
   * - THUMBS_UP      // 👍  赞同、支持
   * - THUMBS_DOWN    // 👎  反对、不推荐
   * - LAUGH          // 😄  觉得好笑、开心
   * - HOORAY         // 🎉  庆祝、恭喜
   * - CONFUSED       // 😕  困惑、不解
   * - HEART          // ❤️  喜欢、喜爱
   * - ROCKET         // 🚀  加油、加速、太棒了！
   * - NEUTRAL        // 中立
   */
  firstAntRepoAction: string;
  /** 历史上参与的其他蚂蚁集团仓库列表 */
  otherAntRepos: string[];

  /** 历史上最喜爱的蚂蚁集团仓库名称（活跃次数最多的仓库） */
  mostFavAntRepo: string;

  /** 2025 年参与蚂蚁仓库的开发者总量 */
  totalAntDeveloperCount: number;
  /** 2025 年活跃的蚂蚁仓库总量 */
  totalAntRepoCount: number;
  /** 2025 年蚂蚁仓库的代码修改行数（新增 + 删除） */
  totalAntCodeChangedLines: number;

  /** 2025 年参与人数最多的一条 Issue 或 PR 的仓库名称 */
  mostParticipateIssueRepoName: string;
  /** 2025 年参与人数最多的一条 Issue 或 PR 的编号 */
  mostParticipateIssueNumber: number;
  /** 2025 年参与人数最多的一条 Issue 或 PR 的标题 */
  mostParticipateIssueTitle: string;
  /** 2025 年参与人数最多的一条 Issue 或 PR 的类型 IssuesEvent, PullRequestEvent, IssueCommentEvent */
  mostParticipateIssueType: string;
  /** 2025 年参与人数最多的一条 Issue 或 PR 的动作 opened, closed, created */
  mostParticipateIssueAction: string;
  /** 2025 年参与人数最多的一条 Issue 或 PR 的日期时间 */
  mostParticipateIssueDateTime: string;
  /** 2025 年参与人数最多的一条 Issue 或 PR 的解决时间（天数） */
  mostParticipateIssueDuration: number;
  /** 2025 年参与人数最多的一条 Issue 或 PR 的开发者列表 */
  mostParticipateIssueDevelopers: number | string[]; // 一些数据用数字统计人数, 也可能是开发者 login 列表
  /** 2025 年参与人数最多的一条 Issue 或 PR 的内容，包括评论内容等 */
  mostParticipateIssueBody: string;

  /** 2025 年最喜欢的仓库名称 */
  favRepoName: string;
  /** 2025 年最喜欢的仓库活跃天数 */
  favRepoActiveDays: number | string;
  /** 2025 年最喜欢的仓库是否为蚂蚁集团仓库 */
  favRepoIsAntRepo: boolean | number;

  /** 2025 年全域协作的开发者数量 */
  collaboratorCount: number;
  /** 2025 年全域协作的开发者列表（最多 3 个） */
  favCollaborators: string[];
  /** 2025 年全域协作的开发者是否为机器人（与 favCollaborators 对应，一一对应） */
  favCollaboratorIsBot: boolean[];

  /** 2025 年最喜欢的编程语言列表（最多 3 个） */
  favLanguages: string[];

  /** 2025 年全年关键词（未实现） */
  petPhrase?: string;
  /** 2025 年全年关键词样本（未实现） */
  petPhraseSamples?: Array<{
    repo: string;
    num: number;
    text?: string;
    textFull: string;
  }>;

  /** 2025 年热爱的仓库名称（深夜活跃） */
  loveRepoName: string;
  /** 2025 年热爱的仓库的深夜活跃月份 */
  loveRepoMonth: number | string;
  /** 2025 年热爱的仓库的深夜活跃日期 */
  loveRepoDay: number | string;
  /** 2025 年热爱的仓库的深夜活跃小时 */
  loveRepoHour: number;
  /** 2025 年热爱的仓库的行为类型（Issue、PR、PushEvent等字符串） */
  loveRepoType: string;
  /** 2025 年热爱的仓库的动作（open、comment、review...） */
  loveRepoAction: string;
  /** 2025 年热爱的仓库的具体内容 */
  loveRepoBody?:
    | string
    | {
        message: string;
        files: Array<{
          path: string;
          additions: number;
          deletions: number;
        }>;
      };
  /** 2025 年热爱的仓库的推送分支名或内容（若为 Push 类型则为复杂对象，否则为字符串） */
  loveRepoRef?:
    | string
    | {
        message: string;
        files: Array<{
          path: string;
          additions: number;
          deletions: number;
        }>;
      };
  /** 2025 年热爱的仓库的深夜活跃次数/编号 */
  loveRepoNumber: number;
  /** 2025 年热爱的仓库的深夜在线开发者数量 */
  loveRepoOnlineDevelopersCount: number;

  /** 2025 年最活跃时段的开始时间 */
  mostActiveHoursStart: number;
  /** 2025 年最活跃时段的结束时间 */
  mostActiveHoursEnd: number;

  /** 2025 年最活跃月份的仓库列表（一月到十二月） */
  mostContributeReposEveryMonth: string[];
  /** 2025 年最活跃月份的仓库是否为蚂蚁集团仓库（一月到十二月） */
  mostContributeReposEveryMonthIsAntRepo: Array<boolean | number>;
  /** 是否是社区贡献之星 */
  isCommunityStar: boolean;
}
