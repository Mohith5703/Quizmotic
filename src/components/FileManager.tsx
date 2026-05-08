
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Folder, 
  FileText, 
  File as FileIcon, 
  Upload, 
  Search, 
  MoreVertical, 
  Trash2, 
  Download,
  Plus,
  ChevronRight,
  FileCode,
  FilePieChart
} from 'lucide-react';
import { cn } from '../lib/utils';

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'txt' | 'json';
  step: number;
  size: string;
  date: string;
  url?: string;
}

const FOLDERS = [
  { id: 0, name: 'Current Dumps' },
  { id: 1, name: 'Step 1 Resources' },
  { id: 2, name: 'Step 2 Resources' },
  { id: 3, name: 'Step 3 Resources' },
  { id: 4, name: 'Step 4 Resources' },
  { id: 5, name: 'Step 5 Resources' },
  { id: 6, name: 'Step 6 Resources' },
];

export default function FileManager() {
  const [selectedStep, setSelectedStep] = React.useState<number>(0);
  const [files, setFiles] = React.useState<FileItem[]>(() => {
    const saved = localStorage.getItem('study_files');
    return saved ? JSON.parse(saved) : [
      { id: 'cd_1', name: 'Angular_MCQs.json', type: 'json', step: 0, size: '42 KB', date: '2024-05-08', url: '/Current Dumps/Angular_MCQs.json' },
      { id: 'cd_2', name: 'React_MCQs.json', type: 'json', step: 0, size: '58 KB', date: '2024-05-08', url: '/Current Dumps/React_MCQs.json' },
      { id: 'cd_3', name: 'NodeJS_MCQs.json', type: 'json', step: 0, size: '48 KB', date: '2024-05-08', url: '/Current Dumps/NodeJS_MCQs.json' },
      { id: 'step1_1', name: 'CLOUD_FSD_DUMPS.pdf', type: 'pdf', step: 1, size: '0.1 MB', date: '2024-04-30', url: '/files/step_1/CLOUD_FSD_DUMPS.pdf' },
      { id: 'step2_1', name: 'FE_Complete_Notes.pdf', type: 'pdf', step: 2, size: '0.1 MB', date: '2024-04-30', url: '/files/step_2/FE_Complete_Notes.pdf' },
      { id: 'step3_1', name: 'Java_Continue_DeepDive.pdf', type: 'pdf', step: 3, size: '0.1 MB', date: '2024-04-30', url: '/files/step_3/Java_Continue_DeepDive.pdf' },
      { id: 'step4_1', name: 'Spring_All_PDF.pdf', type: 'pdf', step: 4, size: '0.1 MB', date: '2024-04-30', url: '/files/step_4/Spring_All_PDF.pdf' },
      { id: 'step5_1', name: 'Java_Spring_DevOps_REST.pdf', type: 'pdf', step: 5, size: '0.1 MB', date: '2024-04-30', url: '/files/step_5/Java_Spring_DevOps_REST.pdf' },
      { id: 'step6_1', name: 'Previous_Year_Dumps.pdf', type: 'pdf', step: 6, size: '0.1 MB', date: '2024-04-30', url: '/files/step_6/Previous_Year_Dumps.pdf' },
    ];
  });

  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('study_files', JSON.stringify(files));
  }, [files]);

  const filteredFiles = files.filter(f => 
    f.step === selectedStep && 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const type = (ext === 'pdf' ? 'pdf' : ext === 'json' ? 'json' : ext === 'doc' || ext === 'docx' ? 'doc' : 'txt') as any;
      
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: type,
        step: selectedStep,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        date: new Date().toISOString().split('T')[0]
      };
      setFiles([...files, newFile]);
    }
  };

  const deleteFile = (id: string) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const downloadFile = (file: FileItem) => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For manually uploaded files that aren't stored in a URL yet
      alert('Local file download placeholder. In a real app, this would trigger a download of the local blob.');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FilePieChart className="text-rose-500" size={24} />;
      case 'doc': return <FileCode className="text-blue-500" size={24} />;
      case 'json': return <FileText className="text-amber-500" size={24} />;
      default: return <FileText className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Sidebar: Steps Navigation */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] px-4 mb-4">Study Folders</h2>
          {FOLDERS.map(folder => (
            <button
              key={folder.id}
              onClick={() => setSelectedStep(folder.id)}
              className={cn(
                "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm text-left group",
                selectedStep === folder.id 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
              )}
            >
              <div className="flex items-center gap-3">
                <Folder size={18} className={cn(selectedStep === folder.id ? "text-indigo-200" : "text-gray-400")} />
                {folder.name}
              </div>
              <div className={cn(
                "text-[10px] px-2 py-0.5 rounded-full",
                selectedStep === folder.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
              )}>
                {files.filter(f => f.step === folder.id).length}
              </div>
            </button>
          ))}
          
          <div className="mt-8 p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2">Storage Info</h4>
            <div className="w-full bg-indigo-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-indigo-600 h-full w-[15%]" />
            </div>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">
              {(files.length * 0.4).toFixed(1)} MB / 50 MB Used
            </p>
          </div>
        </div>

        {/* Main Content: File Explorer */}
        <div className="flex-grow space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight uppercase">
                  {FOLDERS.find(f => f.id === selectedStep)?.name}
                </h1>
                <p className="text-gray-500 font-medium mt-1">Manage your study materials, PDFs, and notes.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 w-full md:w-64"
                  />
                </div>
                <label className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 cursor-pointer">
                  <Upload size={18} />
                  Upload
                  <input type="file" className="hidden" onChange={addFile} accept=".pdf,.doc,.docx,.txt" />
                </label>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {filteredFiles.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-2"
                >
                  <div className="grid grid-cols-12 px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 mb-2">
                    <div className="col-span-6">Name</div>
                    <div className="col-span-2">Size</div>
                    <div className="col-span-2">Date</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  
                  {filteredFiles.map(file => (
                    <motion.div 
                      key={file.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="grid grid-cols-12 items-center px-6 py-4 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-100 group transition-all"
                    >
                      <div className="col-span-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                          {getFileIcon(file.type)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{file.name}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{file.type} Document</p>
                        </div>
                      </div>
                      <div className="col-span-2 text-sm font-bold text-gray-500">{file.size}</div>
                      <div className="col-span-2 text-sm font-bold text-gray-500">{file.date}</div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <button 
                          onClick={() => downloadFile(file)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-indigo-600 transition-all"
                        >
                          <Download size={18} />
                        </button>
                        <button 
                          onClick={() => deleteFile(file.id)}
                          className="p-2 hover:bg-white hover:shadow-sm rounded-lg text-gray-400 hover:text-rose-600 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-gray-400 mb-4 animate-pulse">
                    <FileIcon size={40} />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 uppercase">No files found</h3>
                  <p className="text-gray-500 font-medium mt-2">Upload your study materials for {FOLDERS.find(f => f.id === selectedStep)?.name}</p>
                  <label className="mt-6 flex items-center gap-2 px-6 py-3 bg-white text-gray-600 border border-gray-200 rounded-2xl font-bold text-sm hover:bg-gray-50 transition-all cursor-pointer">
                    <Plus size={18} />
                    Add First File
                    <input type="file" className="hidden" onChange={addFile} accept=".pdf,.doc,.docx,.txt" />
                  </label>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
