import { computed, ref, watch } from 'vue'
import { SITE_EN, SITE_VI } from './data.js'

export const locale = ref('en')
export const isEnglish = computed(() => locale.value === 'en')
export const isVietnamese = computed(() => locale.value === 'vi')
export const isNonChinese = computed(() => locale.value !== 'zh')

const zh = {
  skip: '跳到主要内容', homeAria: '返回首页', navAria: '主导航', mobileNavAria: '移动端主导航', menuAria: '打开或关闭导航菜单', languageAria: '切换网站语言',
  'nav.home': '首页', 'nav.directions': '研究方向', 'nav.projects': '项目', 'nav.outputs': '成果', 'nav.partners': '合作伙伴',
  'page.home': '学术主页', 'page.directions': '研究方向', 'page.projectList': '代表项目', 'page.projectDetail': '项目详情', 'page.outputs': '研究成果', 'page.outputDetail': '成果详情', 'page.partners': '合作高校与合作机构',
  backHome: '← 返回首页', back: '← 返回', item: '项', items: '项', direction: '方向', project: '项目', output: '成果',
  'home.focus': '主要研究复杂能源与汽车动力系统测试。研究方法包括模型在环（MIL）、软件在环（SIL）、硬件在环（HIL）等 X-in-the-Loop 测试和多源数据质量分析；应用领域包括氢能与燃料电池、新能源汽车动力系统。',
  'home.viewDirections': '查看研究方向', 'home.browseOutputs': '浏览研究成果', 'home.statsAria': '学术与工程成果统计',
  'stats.papers': '已发表论文', 'stats.datasets': '公开数据集', 'stats.grantedPatents': '授权发明专利', 'stats.publicApplications': '项已公开申请', 'stats.representativeProjects': '代表项目',
  'home.researchTitle': '研究领域与共性方法', 'home.researchIntro': '研究包括氢能与燃料电池、新能源汽车动力系统两个应用领域，并以智能测试、虚实验证和工程计算为共性方法。',
  'home.app1': '应用领域 01', 'home.app1Title': '氢能与燃料电池', 'home.app1Summary': '主要开展系统测试、湿度调节、状态感知与安全评估。',
  'home.app2': '应用领域 02', 'home.app2Title': '新能源汽车动力系统', 'home.app2Summary': '主要开展电机、电驱与混合动力测试，以及系统集成和性能优化。',
  'home.support': '共性方法支撑两个应用领域', 'home.foundationTitle': '共性方法', 'home.foundationSummary': '采用 X-in-the-Loop、工程计算和数据质量分析，将模型、软件、硬件与试验台架纳入同一验证流程。',
  'home.selectedTitle': '代表性成果', 'home.selectedIntro': '代表性论文、知识产权、公开数据集与工程验证项目。', 'home.selectedOutputs': '代表成果', 'home.selectedProjects': '代表项目', 'home.allOutputs': '查看完整成果体系 →',
  'home.backgroundTitle': '教育与工程经历', 'home.backgroundIntro': '博士培养与汽车动力系统工程经历概览。', 'home.education': '教育经历', 'home.career': '工作经历', 'home.advisor': '导师', 'home.partners': '查看合作高校与机构 →',
  'directions.title': '研究方向', 'directions.intro': '研究分为氢能与燃料电池、新能源汽车动力系统两个应用领域。两个领域共用智能测试、虚实验证、工程计算和数据质量分析方法。',
  'directions.domains': '应用领域', 'directions.appDirs': '应用研究方向', 'directions.foundationCount': '共性方法', 'directions.architecture': '应用领域与共性方法', 'directions.domain': '应用领域', 'directions.support': '共性方法',
  'directions.foundation': '共性方法', 'directions.foundationIntro': '用于连接模型、控制器、试验平台和工程数据。', 'directions.methodBase': '共性方法', 'directions.application': '应用研究方向', 'directions.scope': '研究对象与范围', 'directions.methods': '关键方法', 'directions.relatedProjects': '相关项目', 'directions.relatedOutputs': '相关成果', 'directions.view': '查看方向详情 →', 'directions.technologyBase': '共性方法', 'directions.enter': '进入详情 →',
  'directions.graphTitle': '代表性研究关联图', 'directions.graphIntro': '展示研究方向、共性方法、代表项目与成果之间的联系', 'directions.range': '查看范围', 'directions.panorama': '全景网络', 'directions.commonPrefix': '共性·', 'directions.expand': '展开', 'directions.collapse': '收起',
  'projects.title': '项目经历', 'projects.intro': '研究与工程经历覆盖燃料电池、氢能数据、新能源汽车动力系统、发动机与排放测试等方向。', 'projects.featured': '代表项目', 'projects.all': '完整项目', 'projects.commonSupport': '共性技术支撑', 'projects.other': '其他项目',
  'outputs.title': '成果体系', 'outputs.intro': '成果包括公开论文、授权知识产权、数据集，以及正在同行评审或申请中的工作。', 'outputs.formal': '正式成果', 'outputs.progress': '在投 / 申请中', 'outputs.all': '全部', 'outputs.allTypes': '全部类型', 'outputs.list': '成果列表',
  'partners.title': '高校与合作机构', 'partners.intro': '本页记录联合培养、访问交流、科研协作、测试验证与工程合作经历。', 'partners.universities': '高校交流与培养', 'partners.institutions': '合作机构', 'partners.uniIntro': '包括联合培养、访问交流与科研协作。', 'partners.instIntro': '合作内容包括汽车测试、试验装备、工程验证与质量检验。', 'partners.uniUnit': '所', 'partners.instUnit': '家', 'partners.logoAlt': '校徽',
  'detail.domain': '领域', 'detail.methods': '研究方法与关键技术', 'detail.supportProjects': '支撑项目', 'detail.relatedOutputs': '关联成果', 'detail.relatedDirections': '相关方向', 'detail.notFoundDirection': '研究方向不存在。', 'detail.collapseProjects': '收起项目', 'detail.viewAllProjects': '查看全部 {count} 项目', 'detail.collapseOutputs': '收起成果', 'detail.viewAllOutputs': '查看全部 {count} 项成果',
  'project.info': '项目信息', 'project.category': '项目类别', 'project.time': '项目时间', 'project.partner': '合作 / 资助单位', 'project.role': '本人角色', 'project.tech': '技术分类', 'project.directions': '所属研究方向', 'project.noDirection': '未关联研究方向', 'project.relatedOutputs': '相关成果', 'project.similar': '同类项目', 'project.notFound': '项目不存在。', 'project.backList': '返回项目列表',
  'result.method': '所属方法', 'result.directions': '相关研究方向', 'result.info': '成果信息', 'result.type': '成果类型', 'result.status': '成果状态', 'result.date': '关键日期', 'result.role': '本人角色', 'result.projects': '关联项目', 'result.openResource': '访问公开资源', 'result.notFound': '成果不存在。', 'result.backList': '返回成果列表',
  'graph.scrollAria': '可横向滚动的研究关联图', 'graph.view': '查看{label}', 'graph.empty': '暂无关联数据。', 'graph.claim': '学术主张', 'graph.base': '共性技术', 'graph.direction': '应用方向', 'graph.output': '成果', 'graph.project': '项目', 'graph.representativeProject': '代表项目 {count}', 'graph.claimText': '复杂能源与汽车动力系统的智能测试与虚拟验证',
  'footer.role': '博士候选人 · 电力能源',
  'home.profileLine': 'WANG XIAOPEI · PhD Candidate in Electrical Power & Energy',
  'kicker.profile': 'Academic · Research · Engineering', 'kicker.academicProfile': 'ACADEMIC PROFILE', 'kicker.researchFocus': 'Research Focus', 'kicker.commonFoundation': 'COMMON METHODS', 'kicker.selectedWork': 'Selected Work', 'kicker.background': 'Background',
  'kicker.researchDirections': 'RESEARCH DIRECTIONS', 'kicker.researchArchitecture': 'RESEARCH ARCHITECTURE', 'kicker.applicationDirections': 'APPLICATION DIRECTIONS', 'kicker.commonTechnology': 'COMMON METHODS',
  'kicker.collaborationNetwork': 'COLLABORATION NETWORK', 'kicker.universities': 'UNIVERSITIES', 'kicker.institutions': 'INSTITUTIONS',
  'kicker.commonTechnologyFoundation': 'Common Methods', 'kicker.researchDirection': 'Research Direction', 'kicker.engineeringProject': 'Engineering Project', 'kicker.researchProject': 'Research Project', 'kicker.projects': 'Projects', 'kicker.outputs': 'Outputs', 'kicker.output': 'Output'
}

const en = {
  skip: 'Skip to main content', homeAria: 'Return to home', navAria: 'Main navigation', mobileNavAria: 'Mobile navigation', menuAria: 'Open or close navigation menu', languageAria: 'Switch website language',
  'nav.home': 'Home', 'nav.directions': 'Research', 'nav.projects': 'Projects', 'nav.outputs': 'Outputs', 'nav.partners': 'Collaboration',
  'page.home': 'Academic Homepage', 'page.directions': 'Research Directions', 'page.projectList': 'Selected Projects', 'page.projectDetail': 'Project Details', 'page.outputs': 'Research Outputs', 'page.outputDetail': 'Output Details', 'page.partners': 'Universities and Collaborating Institutions',
  backHome: '← Back to home', back: '← Back', item: 'item', items: 'items', direction: 'Direction', project: 'Project', output: 'Output',
  'home.focus': 'My research focuses on testing complex energy and automotive powertrain systems. Methods include model-in-the-loop (MIL), software-in-the-loop (SIL), hardware-in-the-loop (HIL), broader X-in-the-Loop testing, and multi-source data-quality analysis, with applications in hydrogen and fuel cell systems and new-energy-vehicle powertrains.',
  'home.viewDirections': 'View research directions', 'home.browseOutputs': 'Browse research outputs', 'home.statsAria': 'Academic and engineering profile',
  'stats.papers': 'Published papers', 'stats.datasets': 'Public datasets', 'stats.grantedPatents': 'Granted invention patents', 'stats.publicApplications': 'published applications', 'stats.representativeProjects': 'Selected projects',
  'home.researchTitle': 'Research Areas and Common Methods', 'home.researchIntro': 'The research spans two application areas—hydrogen and fuel cell systems, and new-energy-vehicle powertrains—supported by common methods in intelligent testing, virtual–physical validation, and engineering computing.',
  'home.app1': 'APPLICATION AREA 01', 'home.app1Title': 'Hydrogen and Fuel Cell Systems', 'home.app1Summary': 'System testing, humidity regulation, state sensing, and safety assessment.',
  'home.app2': 'APPLICATION AREA 02', 'home.app2Title': 'New-Energy-Vehicle Powertrains', 'home.app2Summary': 'Motor, electric drive, and hybrid powertrain testing, system integration, and performance optimization.',
  'home.support': 'Common methods support both application areas', 'home.foundationTitle': 'Common Methods', 'home.foundationSummary': 'X-in-the-Loop testing, engineering computing, and data-quality analysis integrate models, software, hardware, and test benches into a unified validation workflow.',
  'home.selectedTitle': 'Selected Work', 'home.selectedIntro': 'Selected papers, intellectual property, public datasets, and engineering validation projects.', 'home.selectedOutputs': 'Selected outputs', 'home.selectedProjects': 'Selected projects', 'home.allOutputs': 'View the complete output portfolio →',
  'home.backgroundTitle': 'Education and Engineering Experience', 'home.backgroundIntro': 'An overview of doctoral training and automotive powertrain engineering experience.', 'home.education': 'Education', 'home.career': 'Professional experience', 'home.advisor': 'Advisor', 'home.partners': 'View universities and partner institutions →',
  'directions.title': 'Research Directions', 'directions.intro': 'The research is organized into two application areas: hydrogen and fuel cell systems, and new-energy-vehicle powertrains. Both are supported by common methods in intelligent testing, virtual–physical validation, engineering computing, and data-quality analysis.',
  'directions.domains': 'Application areas', 'directions.appDirs': 'Application directions', 'directions.foundationCount': 'Common methods', 'directions.architecture': 'Application Areas and Common Methods', 'directions.domain': 'APPLICATION AREA', 'directions.support': 'COMMON METHODS',
  'directions.foundation': 'Common Methods', 'directions.foundationIntro': 'Connecting models, controllers, test platforms, and engineering data.', 'directions.methodBase': 'COMMON METHODS', 'directions.application': 'Application Research Directions', 'directions.scope': 'Research objects and scope', 'directions.methods': 'Key methods', 'directions.relatedProjects': 'Projects', 'directions.relatedOutputs': 'Outputs', 'directions.view': 'View direction →', 'directions.technologyBase': 'COMMON METHODS', 'directions.enter': 'View details →',
  'directions.graphTitle': 'Representative Research Relationship Map', 'directions.graphIntro': 'Connections among research directions, common methods, selected projects, and outputs', 'directions.range': 'Scope', 'directions.panorama': 'Full network', 'directions.commonPrefix': 'Common · ', 'directions.expand': 'Expand', 'directions.collapse': 'Collapse',
  'projects.title': 'Project Experience', 'projects.intro': 'Research and engineering experience across fuel cells, full-chain hydrogen data, new-energy-vehicle powertrains, engines, and emissions testing.', 'projects.featured': 'Selected projects', 'projects.all': 'All projects', 'projects.commonSupport': 'common foundations', 'projects.other': 'Other projects',
  'outputs.title': 'Research Output Portfolio', 'outputs.intro': 'Published research, granted intellectual property, public datasets, and work under peer review or application.', 'outputs.formal': 'Published and granted', 'outputs.progress': 'Under review / application', 'outputs.all': 'All', 'outputs.allTypes': 'All types', 'outputs.list': 'Output list',
  'partners.title': 'Universities and Collaborating Institutions', 'partners.intro': 'This page records joint training, academic visits, research exchange, test validation, and engineering collaboration.', 'partners.universities': 'Academic Training and Visits', 'partners.institutions': 'Collaborating Institutions', 'partners.uniIntro': 'Joint training, academic visits, and research exchange.', 'partners.instIntro': 'Automotive testing, test equipment, engineering validation, and quality inspection.', 'partners.uniUnit': 'universities', 'partners.instUnit': 'institutions', 'partners.logoAlt': 'emblem',
  'detail.domain': 'Area', 'detail.methods': 'Research Methods and Key Technologies', 'detail.supportProjects': 'Supporting Projects', 'detail.relatedOutputs': 'Related Outputs', 'detail.relatedDirections': 'Related Directions', 'detail.notFoundDirection': 'Research direction not found.', 'detail.collapseProjects': 'Show fewer projects', 'detail.viewAllProjects': 'View all {count} projects', 'detail.collapseOutputs': 'Show fewer outputs', 'detail.viewAllOutputs': 'View all {count} outputs',
  'project.info': 'Project Information', 'project.category': 'Category', 'project.time': 'Period', 'project.partner': 'Partner / Funding body', 'project.role': 'Role', 'project.tech': 'Technical area', 'project.directions': 'Research Directions', 'project.noDirection': 'No research direction linked', 'project.relatedOutputs': 'Related Outputs', 'project.similar': 'Related Projects', 'project.notFound': 'Project not found.', 'project.backList': 'Return to project list',
  'result.method': 'Method', 'result.directions': 'Research Directions', 'result.info': 'Output Information', 'result.type': 'Type', 'result.status': 'Status', 'result.date': 'Date', 'result.role': 'Role', 'result.projects': 'Related Projects', 'result.openResource': 'Open public resource', 'result.notFound': 'Output not found.', 'result.backList': 'Return to output list',
  'graph.scrollAria': 'Horizontally scrollable research relationship map', 'graph.view': 'View {label}', 'graph.empty': 'No relationship data available.', 'graph.claim': 'Research focus', 'graph.base': 'Common foundation', 'graph.direction': 'Application direction', 'graph.output': 'Output', 'graph.project': 'Project', 'graph.representativeProject': 'Selected project {count}', 'graph.claimText': 'Intelligent testing and virtual–physical validation of complex energy and automotive powertrain systems',
  'footer.role': 'PhD Candidate · Electrical Power and Energy',
  'home.profileLine': 'WANG XIAOPEI · PhD Candidate in Electrical Power & Energy',
  'kicker.profile': 'Academic · Research · Engineering', 'kicker.academicProfile': 'ACADEMIC PROFILE', 'kicker.researchFocus': 'Research Focus', 'kicker.commonFoundation': 'COMMON METHODS', 'kicker.selectedWork': 'Selected Work', 'kicker.background': 'Background',
  'kicker.researchDirections': 'RESEARCH DIRECTIONS', 'kicker.researchArchitecture': 'RESEARCH ARCHITECTURE', 'kicker.applicationDirections': 'APPLICATION DIRECTIONS', 'kicker.commonTechnology': 'COMMON METHODS',
  'kicker.collaborationNetwork': 'COLLABORATION NETWORK', 'kicker.universities': 'UNIVERSITIES', 'kicker.institutions': 'INSTITUTIONS',
  'kicker.commonTechnologyFoundation': 'Common Methods', 'kicker.researchDirection': 'Research Direction', 'kicker.engineeringProject': 'Engineering Project', 'kicker.researchProject': 'Research Project', 'kicker.projects': 'Projects', 'kicker.outputs': 'Outputs', 'kicker.output': 'Output'
}

const vi = {
  skip: 'Chuyển đến nội dung chính', homeAria: 'Về trang chủ', navAria: 'Điều hướng chính', mobileNavAria: 'Điều hướng trên thiết bị di động', menuAria: 'Mở hoặc đóng menu', languageAria: 'Chuyển ngôn ngữ trang web',
  'nav.home': 'Trang chủ', 'nav.directions': 'Nghiên cứu', 'nav.projects': 'Dự án', 'nav.outputs': 'Kết quả', 'nav.partners': 'Hợp tác',
  'page.home': 'Trang học thuật', 'page.directions': 'Hướng nghiên cứu', 'page.projectList': 'Dự án tiêu biểu', 'page.projectDetail': 'Chi tiết dự án', 'page.outputs': 'Kết quả nghiên cứu', 'page.outputDetail': 'Chi tiết kết quả', 'page.partners': 'Trường đại học và tổ chức hợp tác',
  backHome: '← Về trang chủ', back: '← Quay lại', item: 'mục', items: 'mục', direction: 'Hướng nghiên cứu', project: 'Dự án', output: 'Kết quả',
  'home.focus': 'Nghiên cứu tập trung vào thử nghiệm các hệ thống năng lượng phức hợp và hệ thống truyền động ô tô. Phương pháp chính gồm kiểm thử mô hình trong vòng lặp (MIL), phần mềm trong vòng lặp (SIL), phần cứng trong vòng lặp (HIL), các cấu hình X-in-the-Loop và phân tích chất lượng dữ liệu đa nguồn; hai lĩnh vực ứng dụng là hydro và pin nhiên liệu, cùng hệ thống truyền động xe năng lượng mới.',
  'home.viewDirections': 'Xem các hướng nghiên cứu', 'home.browseOutputs': 'Xem kết quả nghiên cứu', 'home.statsAria': 'Thống kê học thuật và kỹ thuật',
  'stats.papers': 'Bài báo đã công bố', 'stats.datasets': 'Bộ dữ liệu công khai', 'stats.grantedPatents': 'Bằng sáng chế phát minh đã được cấp', 'stats.publicApplications': 'đơn đã công bố', 'stats.representativeProjects': 'Dự án tiêu biểu',
  'home.researchTitle': 'Lĩnh vực và phương pháp nghiên cứu', 'home.researchIntro': 'Nghiên cứu tập trung vào hai lĩnh vực ứng dụng: hệ thống hydro và pin nhiên liệu, cùng hệ thống truyền động xe năng lượng mới. Các phương pháp dùng chung gồm thử nghiệm thông minh, kiểm chứng kết hợp thực–ảo và tính toán kỹ thuật.',
  'home.app1': 'LĨNH VỰC ỨNG DỤNG 01', 'home.app1Title': 'Hydro và pin nhiên liệu', 'home.app1Summary': 'Thử nghiệm hệ thống, điều hòa độ ẩm, nhận biết trạng thái và đánh giá an toàn.',
  'home.app2': 'LĨNH VỰC ỨNG DỤNG 02', 'home.app2Title': 'Hệ thống truyền động xe năng lượng mới', 'home.app2Summary': 'Thử nghiệm động cơ điện, hệ truyền động điện và hệ truyền động hybrid; tích hợp hệ thống và tối ưu hiệu năng.',
  'home.support': 'Các phương pháp dùng chung hỗ trợ cả hai lĩnh vực ứng dụng', 'home.foundationTitle': 'Phương pháp dùng chung', 'home.foundationSummary': 'Kiểm thử X-in-the-Loop, tính toán kỹ thuật và phân tích chất lượng dữ liệu tích hợp mô hình, phần mềm, phần cứng và bệ thử trong một quy trình kiểm chứng thống nhất.',
  'home.selectedTitle': 'Kết quả tiêu biểu', 'home.selectedIntro': 'Các bài báo, tài sản trí tuệ, bộ dữ liệu công khai và dự án kiểm chứng kỹ thuật tiêu biểu.', 'home.selectedOutputs': 'Kết quả tiêu biểu', 'home.selectedProjects': 'Dự án tiêu biểu', 'home.allOutputs': 'Xem toàn bộ kết quả nghiên cứu →',
  'home.backgroundTitle': 'Học vấn và kinh nghiệm kỹ thuật', 'home.backgroundIntro': 'Tổng quan quá trình đào tạo tiến sĩ và kinh nghiệm kỹ thuật về hệ thống truyền động ô tô.', 'home.education': 'Học vấn', 'home.career': 'Kinh nghiệm công tác', 'home.advisor': 'Giảng viên hướng dẫn', 'home.partners': 'Xem các trường và tổ chức hợp tác →',
  'directions.title': 'Hướng nghiên cứu', 'directions.intro': 'Hai lĩnh vực ứng dụng chính là hệ thống hydro và pin nhiên liệu, cùng hệ thống truyền động xe năng lượng mới. Cả hai sử dụng chung các phương pháp thử nghiệm thông minh, kiểm chứng kết hợp thực–ảo, tính toán kỹ thuật và phân tích chất lượng dữ liệu.',
  'directions.domains': 'Lĩnh vực ứng dụng', 'directions.appDirs': 'Hướng nghiên cứu ứng dụng', 'directions.foundationCount': 'Phương pháp dùng chung', 'directions.architecture': 'Lĩnh vực ứng dụng và phương pháp dùng chung', 'directions.domain': 'LĨNH VỰC ỨNG DỤNG', 'directions.support': 'PHƯƠNG PHÁP DÙNG CHUNG',
  'directions.foundation': 'Phương pháp dùng chung', 'directions.foundationIntro': 'Kết nối mô hình, bộ điều khiển, nền tảng thử nghiệm và dữ liệu kỹ thuật.', 'directions.methodBase': 'PHƯƠNG PHÁP DÙNG CHUNG', 'directions.application': 'Các hướng nghiên cứu ứng dụng', 'directions.scope': 'Đối tượng và phạm vi nghiên cứu', 'directions.methods': 'Phương pháp chính', 'directions.relatedProjects': 'Dự án liên quan', 'directions.relatedOutputs': 'Kết quả liên quan', 'directions.view': 'Xem chi tiết hướng nghiên cứu →', 'directions.technologyBase': 'PHƯƠNG PHÁP DÙNG CHUNG', 'directions.enter': 'Xem chi tiết →',
  'directions.graphTitle': 'Sơ đồ liên kết nghiên cứu tiêu biểu', 'directions.graphIntro': 'Mối liên hệ giữa hướng nghiên cứu, phương pháp dùng chung, dự án và kết quả tiêu biểu', 'directions.range': 'Phạm vi', 'directions.panorama': 'Toàn bộ mạng lưới', 'directions.commonPrefix': 'Dùng chung · ', 'directions.expand': 'Mở rộng', 'directions.collapse': 'Thu gọn',
  'projects.title': 'Kinh nghiệm dự án', 'projects.intro': 'Các dự án nghiên cứu và kỹ thuật bao quát pin nhiên liệu, dữ liệu toàn chuỗi hydro, hệ thống truyền động xe năng lượng mới, động cơ đốt trong và thử nghiệm khí thải.', 'projects.featured': 'Dự án tiêu biểu', 'projects.all': 'Toàn bộ dự án', 'projects.commonSupport': 'nền tảng dùng chung', 'projects.other': 'Dự án khác',
  'outputs.title': 'Kết quả nghiên cứu', 'outputs.intro': 'Bao gồm các công bố khoa học, tài sản trí tuệ đã được cấp, bộ dữ liệu công khai và các công trình đang phản biện hoặc trong quá trình đăng ký.', 'outputs.formal': 'Đã công bố và được cấp', 'outputs.progress': 'Đang phản biện / đăng ký', 'outputs.all': 'Tất cả', 'outputs.allTypes': 'Tất cả loại hình', 'outputs.list': 'Danh sách kết quả',
  'partners.title': 'Trường đại học và tổ chức hợp tác', 'partners.intro': 'Trang này ghi lại quá trình đào tạo liên kết, trao đổi học thuật, hợp tác nghiên cứu, kiểm chứng thử nghiệm và triển khai kỹ thuật.', 'partners.universities': 'Đào tạo và trao đổi học thuật', 'partners.institutions': 'Tổ chức hợp tác', 'partners.uniIntro': 'Bao gồm đào tạo liên kết, trao đổi học thuật và hợp tác nghiên cứu.', 'partners.instIntro': 'Thử nghiệm ô tô, thiết bị thử nghiệm, kiểm chứng kỹ thuật và kiểm định chất lượng.', 'partners.uniUnit': 'trường', 'partners.instUnit': 'tổ chức', 'partners.logoAlt': 'biểu trưng',
  'detail.domain': 'Lĩnh vực', 'detail.methods': 'Phương pháp nghiên cứu và công nghệ chính', 'detail.supportProjects': 'Dự án hỗ trợ', 'detail.relatedOutputs': 'Kết quả liên quan', 'detail.relatedDirections': 'Hướng liên quan', 'detail.notFoundDirection': 'Không tìm thấy hướng nghiên cứu.', 'detail.collapseProjects': 'Thu gọn danh sách dự án', 'detail.viewAllProjects': 'Xem tất cả {count} dự án', 'detail.collapseOutputs': 'Thu gọn danh sách kết quả', 'detail.viewAllOutputs': 'Xem tất cả {count} kết quả',
  'project.info': 'Thông tin dự án', 'project.category': 'Loại dự án', 'project.time': 'Thời gian', 'project.partner': 'Đối tác / đơn vị tài trợ', 'project.role': 'Vai trò', 'project.tech': 'Lĩnh vực kỹ thuật', 'project.directions': 'Hướng nghiên cứu', 'project.noDirection': 'Chưa liên kết với hướng nghiên cứu', 'project.relatedOutputs': 'Kết quả liên quan', 'project.similar': 'Dự án liên quan', 'project.notFound': 'Không tìm thấy dự án.', 'project.backList': 'Trở về danh sách dự án',
  'result.method': 'Phương pháp', 'result.directions': 'Hướng nghiên cứu', 'result.info': 'Thông tin kết quả', 'result.type': 'Loại hình', 'result.status': 'Trạng thái', 'result.date': 'Thời gian', 'result.role': 'Vai trò', 'result.projects': 'Dự án liên quan', 'result.openResource': 'Mở tài nguyên công khai', 'result.notFound': 'Không tìm thấy kết quả.', 'result.backList': 'Trở về danh sách kết quả',
  'graph.scrollAria': 'Sơ đồ quan hệ nghiên cứu có thể cuộn ngang', 'graph.view': 'Xem {label}', 'graph.empty': 'Chưa có dữ liệu liên kết.', 'graph.claim': 'Trọng tâm nghiên cứu', 'graph.base': 'Nền tảng dùng chung', 'graph.direction': 'Hướng ứng dụng', 'graph.output': 'Kết quả', 'graph.project': 'Dự án', 'graph.representativeProject': 'Dự án tiêu biểu {count}', 'graph.claimText': 'Thử nghiệm thông minh và kiểm chứng kết hợp thực–ảo cho các hệ thống năng lượng phức hợp và hệ thống truyền động ô tô',
  'footer.role': 'Nghiên cứu sinh tiến sĩ · Điện năng và năng lượng',
  'home.profileLine': 'WANG XIAOPEI · Nghiên cứu sinh tiến sĩ ngành Điện năng và Năng lượng',
  'kicker.profile': 'HỌC THUẬT · NGHIÊN CỨU · KỸ THUẬT', 'kicker.academicProfile': 'HỒ SƠ HỌC THUẬT', 'kicker.researchFocus': 'TRỌNG TÂM NGHIÊN CỨU', 'kicker.commonFoundation': 'PHƯƠNG PHÁP DÙNG CHUNG', 'kicker.selectedWork': 'KẾT QUẢ TIÊU BIỂU', 'kicker.background': 'HỌC VẤN VÀ KINH NGHIỆM',
  'kicker.researchDirections': 'HƯỚNG NGHIÊN CỨU', 'kicker.researchArchitecture': 'CẤU TRÚC NGHIÊN CỨU', 'kicker.applicationDirections': 'HƯỚNG NGHIÊN CỨU ỨNG DỤNG', 'kicker.commonTechnology': 'PHƯƠNG PHÁP DÙNG CHUNG',
  'kicker.collaborationNetwork': 'MẠNG LƯỚI HỢP TÁC', 'kicker.universities': 'TRƯỜNG ĐẠI HỌC', 'kicker.institutions': 'TỔ CHỨC',
  'kicker.commonTechnologyFoundation': 'Phương pháp dùng chung', 'kicker.researchDirection': 'Hướng nghiên cứu', 'kicker.engineeringProject': 'Dự án kỹ thuật', 'kicker.researchProject': 'Dự án nghiên cứu', 'kicker.projects': 'Dự án', 'kicker.outputs': 'Kết quả', 'kicker.output': 'Kết quả'
}

export function t(key, params = {}) {
  const table = locale.value === 'en' ? en : locale.value === 'vi' ? vi : zh
  let value = table[key] ?? zh[key] ?? key
  Object.entries(params).forEach(([name, replacement]) => { value = value.replaceAll(`{${name}}`, String(replacement)) })
  return value
}

export function setLocale(next) {
  locale.value = ['zh', 'en', 'vi'].includes(next) ? next : 'en'
}

watch(locale, next => {
  if (typeof document !== 'undefined') document.documentElement.lang = next === 'en' ? 'en' : next === 'vi' ? 'vi' : 'zh-CN'
}, { immediate: true })

const activeOverlay = () => locale.value === 'en' ? SITE_EN : locale.value === 'vi' ? SITE_VI : null
export const lBasic = field => activeOverlay()?.basic?.[field] ?? ''
export const lDirection = (direction, field) => activeOverlay()?.directions?.[direction?.id]?.[field] ?? direction?.[field] ?? ''
export const lProject = (project, field) => activeOverlay()?.projects?.[project?.id]?.[field] ?? project?.[field] ?? ''
export const lPartner = (partner, field) => activeOverlay()?.partners?.[partner?.name]?.[field] ?? (isNonChinese.value && field === 'name' ? partner?.en : partner?.[field]) ?? ''
export const lEducation = (record, field) => activeOverlay()?.basic?.education?.[record?.school]?.[field] ?? record?.[field] ?? ''
export const lCareer = (record, field) => activeOverlay()?.basic?.career?.[record?.org]?.[field] ?? record?.[field] ?? ''
export const lResult = (result, field) => activeOverlay()?.results?.[result?.name]?.[field] ?? result?.[field] ?? ''

const typeEn = { '期刊论文': 'Journal article', '会议论文': 'Conference paper', '会议摘要': 'Conference abstract', '发明专利': 'Invention patent', '实用新型专利': 'Utility model patent', '技术报告': 'Technical report', '数据集': 'Dataset', '标准': 'Standard', '教材': 'Book chapter', '软件著作权': 'Registered software' }
const categoryEn = { '工程交付': 'Engineering project', '研发项目': 'Research project' }
const roleEn = { '技术负责人/核心工程师': 'Technical lead / Core engineer', '核心工程师': 'Core engineer', '主要参与人': 'Contributor', '项目经理': 'Project manager', '项目经理/核心工程师': 'Project manager / Core engineer', '核心工程师/项目经理': 'Core engineer / Project manager', '软件工程师': 'Software engineer', '算法工程师': 'Algorithm engineer', '通讯作者': 'Corresponding author', '第一作者': 'First author', '第2作者': 'Second author', '第3作者': 'Third author', '共同作者': 'Co-author', '第一发明人': 'First inventor', '主要发明人': 'Principal inventor', '主要开发人': 'Principal developer', '参与': 'Contributor' }
const techEn = { '混合动力与动力总成': 'Hybrid powertrains', '燃料电池测试与控制': 'Fuel cell testing and control', 'SIL/HIL/XIL与测试软件': 'SIL/HIL/XIL and test software', '发动机排放与道路工况': 'Engines, emissions, and road conditions', '氢能全链数据与碳核算': 'Full-chain hydrogen data and carbon accounting', '电机与电驱测试': 'Motor and electric drive testing', '电池BMS与换电': 'Battery management and swapping', '数据采集管理与可信度': 'Data acquisition, management, and credibility', '多能源系统建模与调度': 'Multi-energy-system modelling and scheduling' }
const clientEn = { '合作单位已脱敏': 'Partner withheld for confidentiality', '国家重点研发计划': 'National Key R&D Program of China', '省级发改委': 'Provincial Development and Reform Commission', '丰田汽车公司': 'Toyota Motor Corporation', '地方政府': 'Local government' }
const statusEn = { '已公开': 'Published', '评审中': 'Under review', '规划': 'Planned', '在途': 'In progress', '已录用': 'Accepted', '已发表/已公开': 'Published / Public', '已授权': 'Granted', '已提交': 'Submitted', '编制中': 'In preparation', '已申请': 'Filed', '审核中': 'Under review' }

const typeVi = { '期刊论文': 'Bài báo tạp chí', '会议论文': 'Bài báo hội nghị', '会议摘要': 'Tóm tắt hội nghị', '发明专利': 'Bằng sáng chế', '实用新型专利': 'Bằng độc quyền giải pháp hữu ích', '技术报告': 'Báo cáo kỹ thuật', '数据集': 'Bộ dữ liệu', '标准': 'Tiêu chuẩn', '教材': 'Chương sách', '软件著作权': 'Phần mềm đã đăng ký' }
const categoryVi = { '工程交付': 'Dự án kỹ thuật', '研发项目': 'Dự án nghiên cứu' }
const roleVi = { '技术负责人/核心工程师': 'Phụ trách kỹ thuật / Kỹ sư nòng cốt', '核心工程师': 'Kỹ sư nòng cốt', '主要参与人': 'Thành viên chính', '项目经理': 'Quản lý dự án', '项目经理/核心工程师': 'Quản lý dự án / Kỹ sư nòng cốt', '核心工程师/项目经理': 'Kỹ sư nòng cốt / Quản lý dự án', '软件工程师': 'Kỹ sư phần mềm', '算法工程师': 'Kỹ sư thuật toán', '通讯作者': 'Tác giả liên hệ', '第一作者': 'Tác giả thứ nhất', '第2作者': 'Tác giả thứ hai', '第3作者': 'Tác giả thứ ba', '共同作者': 'Đồng tác giả', '第一发明人': 'Nhà sáng chế thứ nhất', '主要发明人': 'Nhà sáng chế chính', '主要开发人': 'Nhà phát triển chính', '参与': 'Thành viên tham gia' }
const techVi = { '混合动力与动力总成': 'Hệ truyền động hybrid', '燃料电池测试与控制': 'Thử nghiệm và điều khiển pin nhiên liệu', 'SIL/HIL/XIL与测试软件': 'SIL/HIL/XIL và phần mềm thử nghiệm', '发动机排放与道路工况': 'Động cơ, khí thải và điều kiện vận hành đường bộ', '氢能全链数据与碳核算': 'Dữ liệu toàn chuỗi hydro và hạch toán carbon', '电机与电驱测试': 'Thử nghiệm động cơ điện và hệ truyền động điện', '电池BMS与换电': 'Hệ thống quản lý pin và đổi pin', '数据采集管理与可信度': 'Thu thập, quản lý và đánh giá độ tin cậy dữ liệu', '多能源系统建模与调度': 'Mô hình hóa và điều độ hệ thống đa năng lượng' }
const clientVi = { '合作单位已脱敏': 'Đối tác không công bố theo yêu cầu bảo mật', '国家重点研发计划': 'Chương trình R&D trọng điểm quốc gia Trung Quốc', '省级发改委': 'Ủy ban Phát triển và Cải cách cấp tỉnh', '丰田汽车公司': 'Tập đoàn Ô tô Toyota', '地方政府': 'Chính quyền địa phương' }
const statusVi = { '已公开': 'Đã công bố', '评审中': 'Đang phản biện', '规划': 'Đang xây dựng', '在途': 'Đang thực hiện', '已录用': 'Đã được chấp nhận', '已发表/已公开': 'Đã công bố / công khai', '已授权': 'Đã được cấp', '已提交': 'Đã nộp', '编制中': 'Đang biên soạn', '已申请': 'Đã đăng ký', '审核中': 'Đang thẩm định' }

const localizedMapValue = (value, enMap, viMap) => locale.value === 'en' ? (enMap[value] ?? value) : locale.value === 'vi' ? (viMap[value] ?? value) : value

export const typeLabel = value => localizedMapValue(value, typeEn, typeVi)
export const categoryLabel = value => localizedMapValue(value, categoryEn, categoryVi)
export const roleLabel = value => localizedMapValue(value, roleEn, roleVi)
export const techLabel = value => localizedMapValue(value, techEn, techVi)
export const clientLabel = value => localizedMapValue(value, clientEn, clientVi)
export const statusFullLabel = value => localizedMapValue(value, statusEn, statusVi)

export function dateLabel(value) {
  if (!isNonChinese.value || !value) return value
  return String(value)
    .replace(/至今/g, locale.value === 'vi' ? 'Hiện tại' : 'Present')
    .replace(/(\d{4})年(\d{1,2})月(\d{1,2})日/g, (_, year, month, day) => locale.value === 'vi' ? `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}` : `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`)
    .replace(/(\d{4})年/g, '$1')
    .replace(/→/g, '–')
}

export function englishKernelLabel(value) {
  if (!isNonChinese.value || !value) return ''
  const raw = value.includes('｜') ? value.slice(value.indexOf('｜') + 1) : value
  const replacementsEn = [
    ['燃料电池', 'fuel cell'], ['氢能', 'hydrogen'], ['新能源汽车', 'new-energy-vehicle'], ['测试台', 'test-bench'], ['测试平台', 'test platform'], ['测试主控', 'supervisory test control'],
    ['多源多频数据融合与可信度审计', 'Multi-source and multi-rate data fusion and credibility auditing'], ['研发台架碳排放核算与数据校验', 'Carbon accounting and data validation for R&D test benches'], ['车辆碳排放核算、控制与数据校验', 'Vehicle carbon-emission accounting, control, and data validation'],
    ['通用XIL与智能测试基础设施', 'General XIL and intelligent testing infrastructure'], ['通用仿真模型库与接口适配', 'General simulation model libraries and interface adaptation'], ['自动化测试流程与用例执行', 'Automated test workflows and test-case execution'], ['试验任务、流程与结果管理', 'Test-task, workflow, and result management'], ['测试数据管理、组织与追溯', 'Test-data management, organization, and traceability']
  ]
  const replacementsVi = [
    ['燃料电池', 'pin nhiên liệu'], ['氢能', 'năng lượng hydro'], ['新能源汽车', 'xe năng lượng mới'], ['测试台', 'bệ thử'], ['测试平台', 'nền tảng thử nghiệm'], ['测试主控', 'điều khiển giám sát thử nghiệm'],
    ['多源多频数据融合与可信度审计', 'Tích hợp dữ liệu đa nguồn, đa tần suất và đánh giá độ tin cậy'], ['研发台架碳排放核算与数据校验', 'Hạch toán phát thải carbon và kiểm tra dữ liệu cho bệ thử R&D'], ['车辆碳排放核算、控制与数据校验', 'Hạch toán, kiểm soát phát thải carbon và kiểm tra dữ liệu phương tiện'],
    ['通用XIL与智能测试基础设施', 'Hạ tầng XIL dùng chung và thử nghiệm thông minh'], ['通用仿真模型库与接口适配', 'Thư viện mô hình mô phỏng dùng chung và thích ứng giao diện'], ['自动化测试流程与用例执行', 'Quy trình thử nghiệm tự động và thực thi ca kiểm thử'], ['试验任务、流程与结果管理', 'Quản lý nhiệm vụ, quy trình và kết quả thử nghiệm'], ['测试数据管理、组织与追溯', 'Quản lý, tổ chức và truy xuất dữ liệu thử nghiệm']
  ]
  const exact = (locale.value === 'vi' ? replacementsVi : replacementsEn).find(([source]) => source === raw)
  return exact ? exact[1] : raw
}

export const resultTitle = result => lResult(result, 'name')
export const resultReference = result => lResult(result, 'publicReference')
export const resultKernel = result => {
  if (!result?.kernel) return ''
  if (!isNonChinese.value) return result.kernel.includes('｜') ? result.kernel.slice(result.kernel.indexOf('｜') + 1) : result.kernel
  return activeOverlay()?.results?.[result.name]?.kernel ?? englishKernelLabel(result.kernel)
}
