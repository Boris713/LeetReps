// static company universe — 98 firms across quant, AI labs, infra startups, and safety nets.
// mutable tracking state (status, notes, referral, dateApplied) lives in localStorage, not here.

export const CATEGORY_LABELS = {
  quant_hft:        'Quant — HFT',
  quant_prop:       'Quant — Prop Trading',
  quant_prop_small: 'Quant — Smaller Prop',
  quant_hf_mm:      'Quant — Multi-Manager HF',
  quant_hf_central: 'Quant — Centralized HF',
  ai_lab:           'AI Labs',
  startup_infra:    'Startups — AI Infra / Dev Tools',
  startup_app:      'Startups — AI App Layer',
  startup_robotics: 'Startups — Robotics',
  ai_hardware:      'AI Hardware',
  safety_net:       'Safety Net / Brand',
}

export const CATEGORY_ORDER = [
  'quant_hft', 'quant_prop', 'quant_prop_small', 'quant_hf_mm', 'quant_hf_central',
  'ai_lab', 'startup_infra', 'startup_app', 'startup_robotics', 'ai_hardware', 'safety_net',
]

const COMPANIES = [
  // quant hft
  { name: 'Hudson River Trading',       category: 'quant_hft',        priority: 'P1', tc: '300-400k',    careersUrl: '', hint: 'C++/low-latency. Algo Dev can be eng-heavy, read JD.' },
  { name: 'Jump Trading',               category: 'quant_hft',        priority: 'P1', tc: '300-400k',    careersUrl: '', hint: 'Low-latency/systems heavy.' },
  { name: 'Virtu Financial',            category: 'quant_hft',        priority: 'P1', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Tower Research',             category: 'quant_hft',        priority: 'P1', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Quantlab',                   category: 'quant_hft',        priority: 'P1', tc: '200-300k',    careersUrl: '', hint: 'Houston.' },
  { name: 'Headlands',                  category: 'quant_hft',        priority: 'P1', tc: '200-300k',    careersUrl: '', hint: 'C++ trading software. NOT Research Developer.' },
  { name: 'HAP Capital',                category: 'quant_hft',        priority: 'P2', tc: '200-300k',    careersUrl: '', hint: 'Smaller, apply direct.' },

  // quant prop
  { name: 'Jane Street',                category: 'quant_prop',       priority: 'P1', tc: '350-400k',    careersUrl: '', hint: 'Highest-confidence target. OCaml. ~$300k base.' },
  { name: 'Citadel Securities',         category: 'quant_prop',       priority: 'P1', tc: '300-400k',    careersUrl: '', hint: 'Market maker; huge eng org.' },
  { name: 'IMC Trading',                category: 'quant_prop',       priority: 'P1', tc: '250-425k',    careersUrl: '', hint: 'Conversion offers reported high end.' },
  { name: 'Optiver',                    category: 'quant_prop',       priority: 'P1', tc: '250-350k',    careersUrl: '', hint: 'Options market maker.' },
  { name: 'Akuna Capital',              category: 'quant_prop',       priority: 'P1', tc: '200-300k',    careersUrl: '', hint: 'Chicago.' },
  { name: 'DRW',                        category: 'quant_prop',       priority: 'P1', tc: '250-350k',    careersUrl: '', hint: 'Skip Quant Trading Analyst (trader role).' },
  { name: 'SIG',                        category: 'quant_prop',       priority: 'P1', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Five Rings',                 category: 'quant_prop',       priority: 'P1', tc: '250-350k',    careersUrl: '', hint: 'NYC.' },
  { name: 'Chicago Trading Co (CTC)',   category: 'quant_prop',       priority: 'P1', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Old Mission Capital',        category: 'quant_prop',       priority: 'P2', tc: '200-300k',    careersUrl: '', hint: 'Skip Junior Quant Trader.' },
  { name: 'TransMarket Group',          category: 'quant_prop',       priority: 'P2', tc: '180-280k',    careersUrl: '', hint: '' },
  { name: 'GTS',                        category: 'quant_prop',       priority: 'P2', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Volant Trading',             category: 'quant_prop',       priority: 'P2', tc: '180-280k',    careersUrl: '', hint: '' },
  { name: 'Flow Traders',               category: 'quant_prop',       priority: 'P2', tc: '180-280k',    careersUrl: '', hint: '' },
  { name: 'Radix Trading',              category: 'quant_prop',       priority: 'P2', tc: '200-300k',    careersUrl: '', hint: '' },

  // quant smaller prop
  { name: 'Wolverine Trading',          category: 'quant_prop_small', priority: 'P2', tc: '180-280k',    careersUrl: '', hint: '' },
  { name: 'Belvedere Trading',          category: 'quant_prop_small', priority: 'P2', tc: '180-260k',    careersUrl: '', hint: '' },
  { name: 'Group One Trading',          category: 'quant_prop_small', priority: 'P2', tc: '180-260k',    careersUrl: '', hint: '' },
  { name: 'Peak6',                      category: 'quant_prop_small', priority: 'P2', tc: '180-260k',    careersUrl: '', hint: '' },
  { name: 'XR Trading',                 category: 'quant_prop_small', priority: 'P2', tc: '180-260k',    careersUrl: '', hint: '' },
  { name: 'Eagle Seven',                category: 'quant_prop_small', priority: 'P3', tc: '180-260k',    careersUrl: '', hint: '' },
  { name: '3Red Partners',              category: 'quant_prop_small', priority: 'P3', tc: '180-260k',    careersUrl: '', hint: '' },
  { name: 'Spot Trading',               category: 'quant_prop_small', priority: 'P3', tc: '180-260k',    careersUrl: '', hint: '' },
  { name: 'WH Trading',                 category: 'quant_prop_small', priority: 'P3', tc: '180-260k',    careersUrl: '', hint: '' },
  { name: 'DV Trading',                 category: 'quant_prop_small', priority: 'P3', tc: '180-260k',    careersUrl: '', hint: '' },

  // quant multi-manager hf
  { name: 'Citadel (the fund)',         category: 'quant_hf_mm',      priority: 'P1', tc: '300-400k',    careersUrl: '', hint: 'Separate from Citadel Securities, apply to both.' },
  { name: 'Millennium',                 category: 'quant_hf_mm',      priority: 'P2', tc: '200-350k',    careersUrl: '', hint: 'Central eng + pod-aligned dev.' },
  { name: 'Point72 / Cubist',           category: 'quant_hf_mm',      priority: 'P2', tc: '200-300k',    careersUrl: '', hint: 'Has a formal new-grad Academy.' },
  { name: 'Balyasny',                   category: 'quant_hf_mm',      priority: 'P2', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'WorldQuant',                 category: 'quant_hf_mm',      priority: 'P2', tc: '180-280k',    careersUrl: '', hint: 'Runs a structured program.' },
  { name: 'GSA Capital',                category: 'quant_hf_mm',      priority: 'P2', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Schonfeld',                  category: 'quant_hf_mm',      priority: 'P2', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'ExodusPoint',                category: 'quant_hf_mm',      priority: 'P3', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Tudor',                      category: 'quant_hf_mm',      priority: 'P3', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Engineers Gate',             category: 'quant_hf_mm',      priority: 'P3', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Verition',                   category: 'quant_hf_mm',      priority: 'P3', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Centiva',                    category: 'quant_hf_mm',      priority: 'P3', tc: '180-280k',    careersUrl: '', hint: '' },
  { name: 'Walleye',                    category: 'quant_hf_mm',      priority: 'P3', tc: '180-280k',    careersUrl: '', hint: '' },

  // quant centralized hf
  { name: 'DE Shaw',                    category: 'quant_hf_central', priority: 'P1', tc: '250-400k',    careersUrl: '', hint: 'Strong central SWE pipeline.' },
  { name: 'Two Sigma',                  category: 'quant_hf_central', priority: 'P1', tc: '250-350k',    careersUrl: '', hint: '' },
  { name: 'PDT Partners',               category: 'quant_hf_central', priority: 'P2', tc: '200-350k',    careersUrl: '', hint: '' },
  { name: 'Squarepoint',                category: 'quant_hf_central', priority: 'P2', tc: '200-300k',    careersUrl: '', hint: 'Systematic; real eng roles.' },
  { name: 'G-Research',                 category: 'quant_hf_central', priority: 'P2', tc: '200-300k',    careersUrl: '', hint: 'London; strong eng.' },
  { name: 'TGS',                        category: 'quant_hf_central', priority: 'P2', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'Voleon',                     category: 'quant_hf_central', priority: 'P2', tc: '200-300k',    careersUrl: '', hint: 'ML-driven; technically deep.' },
  { name: 'AQR',                        category: 'quant_hf_central', priority: 'P3', tc: '180-280k',    careersUrl: '', hint: 'Has real eng but slower/quant-research lean.' },
  { name: 'Aquatic Capital',            category: 'quant_hf_central', priority: 'P3', tc: '200-300k',    careersUrl: '', hint: '' },
  { name: 'RenTec (Renaissance)',       category: 'quant_hf_central', priority: 'P4', tc: '300k+',       careersUrl: '', hint: 'Near-closed to new grads. Lottery.' },
  { name: 'Bridgewater',                category: 'quant_hf_central', priority: 'P4', tc: '180-260k',    careersUrl: '', hint: 'Macro/slower; research-flavored.' },

  // ai labs
  { name: 'OpenAI',                     category: 'ai_lab',           priority: 'P1', tc: '300-500k+',   careersUrl: '', hint: 'Runs structured early-career hiring.' },
  { name: 'Anthropic',                  category: 'ai_lab',           priority: 'P1', tc: '300-450k+',   careersUrl: 'https://job-boards.greenhouse.io/anthropic', hint: 'No new-grad/university track currently. Entry points: Fellows Program or referral hire.' },
  { name: 'xAI',                        category: 'ai_lab',           priority: 'P1', tc: '250-450k',    careersUrl: '', hint: 'Hires juniors more readily than Anthropic.' },
  { name: 'Google DeepMind',            category: 'ai_lab',           priority: 'P1', tc: '250-350k',    careersUrl: '', hint: "Google's actual new-grad machinery. Apply via Google Careers." },
  { name: 'Thinking Machines Lab',      category: 'ai_lab',           priority: 'P2', tc: 'high, variable', careersUrl: '', hint: 'Early stage, more upside, less liquidity.' },
  { name: 'SSI',                        category: 'ai_lab',           priority: 'P2', tc: 'high, variable', careersUrl: '', hint: 'Very early/selective.' },

  // startups infra
  { name: 'Anysphere (Cursor)',         category: 'startup_infra',    priority: 'P1', tc: '250k+',       careersUrl: '', hint: 'No new-grad team now; staff/senior focus. Referral-only longshot, check back Q4.' },
  { name: 'Databricks',                 category: 'startup_infra',    priority: 'P1', tc: '200-280k',    careersUrl: '', hint: 'High new-grad band; near-IPO.' },
  { name: 'Modal Labs',                 category: 'startup_infra',    priority: 'P2', tc: '180-250k+eq', careersUrl: '', hint: 'Serverless GPU infra; deep systems.' },
  { name: 'Baseten',                    category: 'startup_infra',    priority: 'P2', tc: '180-250k+eq', careersUrl: '', hint: 'Inference infra; fast-scaling.' },
  { name: 'Together AI',                category: 'startup_infra',    priority: 'P2', tc: '180-250k+eq', careersUrl: '', hint: 'Inference/training infra.' },
  { name: 'Fireworks AI',               category: 'startup_infra',    priority: 'P2', tc: '180-250k+eq', careersUrl: '', hint: 'Inference infra; technically deep.' },
  { name: 'ClickHouse',                 category: 'startup_infra',    priority: 'P2', tc: '180-260k+eq', careersUrl: '', hint: 'OLAP database; hard systems/C++.' },
  { name: 'Crusoe',                     category: 'startup_infra',    priority: 'P2', tc: '180-250k+eq', careersUrl: '', hint: 'AI cloud/datacenter infra.' },
  { name: 'Lambda Labs',                category: 'startup_infra',    priority: 'P3', tc: '170-240k+eq', careersUrl: '', hint: 'GPU cloud; IPO-track.' },
  { name: 'Exa',                        category: 'startup_infra',    priority: 'P3', tc: '180-250k+eq', careersUrl: '', hint: 'Search/retrieval infra for AI.' },
  { name: 'Poolside',                   category: 'startup_infra',    priority: 'P3', tc: 'high, variable', careersUrl: '', hint: 'Coding model lab; deep tech.' },
  { name: 'Factory AI',                 category: 'startup_infra',    priority: 'P3', tc: 'variable+eq', careersUrl: '', hint: 'Agentic coding; technically hard.' },

  // startups app layer
  { name: 'Ramp',                       category: 'startup_app',      priority: 'P3', tc: '180-250k+eq', careersUrl: '', hint: 'Fintech; strong growth.' },
  { name: 'Harvey',                     category: 'startup_app',      priority: 'P3', tc: 'variable+eq', careersUrl: '', hint: 'Legal AI.' },
  { name: 'Sierra',                     category: 'startup_app',      priority: 'P3', tc: 'variable+eq', careersUrl: '', hint: 'Agentic CX.' },
  { name: 'Decagon',                    category: 'startup_app',      priority: 'P3', tc: 'variable+eq', careersUrl: '', hint: 'AI customer support; growing fast.' },
  { name: 'Clay',                       category: 'startup_app',      priority: 'P3', tc: 'variable+eq', careersUrl: '', hint: 'GTM data.' },
  { name: 'Glean',                      category: 'startup_app',      priority: 'P3', tc: 'variable+eq', careersUrl: '', hint: 'Enterprise search.' },
  { name: 'Wispr Flow',                 category: 'startup_app',      priority: 'P3', tc: 'variable+eq', careersUrl: '', hint: '~$2B raise, great growth.' },
  { name: 'Applied Intuition',          category: 'startup_app',      priority: 'P3', tc: '200-280k+eq', careersUrl: '', hint: 'AV; pays well. Has a defense arm.' },
  { name: 'TextQL',                     category: 'startup_app',      priority: 'P4', tc: 'variable+eq', careersUrl: '', hint: 'Agentic analytics; technically interesting but early/small.' },

  // startups robotics
  { name: 'Physical Intelligence',      category: 'startup_robotics', priority: 'P3', tc: 'high, variable', careersUrl: '', hint: 'Robot foundation models; elite team.' },
  { name: 'Skild AI',                   category: 'startup_robotics', priority: 'P3', tc: 'high, variable', careersUrl: '', hint: 'Robotics foundation models.' },
  { name: 'Figure',                     category: 'startup_robotics', priority: 'P3', tc: '180-260k+eq', careersUrl: '', hint: 'Humanoid robots; very hard tech.' },

  // ai hardware
  { name: 'Etched',                     category: 'ai_hardware',      priority: 'P3', tc: '180-250k+eq', careersUrl: '', hint: 'Transformer ASIC.' },
  { name: 'Positron',                   category: 'ai_hardware',      priority: 'P3', tc: 'variable+eq', careersUrl: '', hint: '' },
  { name: 'Tenstorrent',                category: 'ai_hardware',      priority: 'P3', tc: '180-250k+eq', careersUrl: '', hint: '' },
  { name: 'd-Matrix',                   category: 'ai_hardware',      priority: 'P3', tc: '180-250k+eq', careersUrl: '', hint: '' },
  { name: 'MatX',                       category: 'ai_hardware',      priority: 'P3', tc: 'variable+eq', careersUrl: '', hint: '' },
  { name: 'Lightmatter',               category: 'ai_hardware',      priority: 'P3', tc: '180-250k+eq', careersUrl: '', hint: 'Photonic compute.' },
  { name: 'Rivos',                      category: 'ai_hardware',      priority: 'P3', tc: '180-250k+eq', careersUrl: '', hint: '' },

  // safety net
  { name: 'Meta',                       category: 'safety_net',       priority: 'P2', tc: '190k',        careersUrl: '', hint: 'Your return, take it, leverage it.' },
  { name: 'Netflix',                    category: 'safety_net',       priority: 'P3', tc: '300k+ cash',  careersUrl: '', hint: 'Rarely hires new grads; high cash if so.' },
  { name: 'Nvidia',                     category: 'safety_net',       priority: 'P3', tc: '150-200k',    careersUrl: '', hint: 'Good for AI-hardware-adjacent dev.' },
  { name: 'Notion',                     category: 'safety_net',       priority: 'P3', tc: '180-230k',    careersUrl: '', hint: '' },
  { name: 'Pinterest',                  category: 'safety_net',       priority: 'P3', tc: '180-230k',    careersUrl: '', hint: '' },
]

export default COMPANIES
