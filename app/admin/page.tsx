'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface Student {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  grade: number | null;
  target_score: number | null;
  created_at: string;
  // Calculated fields
  totalXP?: number;
  questsCompleted?: number;
  weeklyQuestions?: number;
  totalCoins?: number;
}

interface PurchaseRequest {
  id: string;
  studentName: string;
  reward: string;
  coinCost: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
}

interface DailyVideo {
  id: string;
  date: string;
  title: string;
  videoId: string;
  description: string;
  isActive: boolean;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  icon: string;
  grade: number;
}

interface Topic {
  id: string;
  subject_id: string;
  name: string;
  description: string | null;
  difficulty_level: number;
  importance_level: number;
  lgs_frequency: number;
}

interface Book {
  id: string;
  title: string;
  author: string;
  category_id: string;
  total_pages: number;
  cover_image: string;
  difficulty: string;
  age_range: string;
  description: string;
  is_active: boolean;
  category?: { name: string; color: string; icon: string };
}

interface BookCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  order_index: number;
}

// Mock students removed - now using real Supabase data

const mockPurchaseRequests: PurchaseRequest[] = [
  {
    id: '1',
    studentName: 'Ahmet Yılmaz',
    reward: 'PlayStation 5 Oyun Kodu',
    coinCost: 500,
    status: 'pending',
    requestDate: '2024-01-15'
  },
  {
    id: '2',
    studentName: 'Zeynep Kaya',
    reward: 'Netflix Hediye Kartı',
    coinCost: 150,
    status: 'pending',
    requestDate: '2024-01-14'
  },
  {
    id: '3',
    studentName: 'Elif Öztürk',
    reward: 'Bluetooth Kulaklık',
    coinCost: 300,
    status: 'approved',
    requestDate: '2024-01-13'
  }
];

const mockDailyVideos: DailyVideo[] = [
  {
    id: '1',
    date: '2024-01-15',
    title: 'LGS Matematik Motivasyonu',
    videoId: 'dQw4w9WgXcQ',
    description: 'Matematik sorularına yaklaşımın nasıl olmalı?',
    isActive: true
  },
  {
    id: '2',
    date: '2024-01-16',
    title: 'Başarı Hikayesi - Eski LGS Birincisi',
    videoId: 'dQw4w9WgXcQ',
    description: 'Geçen sene LGS birincisi olan öğrencinin deneyimleri',
    isActive: true
  },
  {
    id: '3',
    date: '2024-01-17',
    title: 'Etkili Çalışma Teknikleri',
    videoId: 'dQw4w9WgXcQ',
    description: 'Daha verimli nasıl çalışabilirsin?',
    isActive: true
  }
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'students' | 'purchases' | 'questions' | 'videos' | 'curriculum' | 'library'>('dashboard');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(mockPurchaseRequests);
  const [dailyVideos, setDailyVideos] = useState<DailyVideo[]>(mockDailyVideos);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<DailyVideo | null>(null);
  const [videoForm, setVideoForm] = useState({
    date: '',
    title: '',
    videoId: '',
    description: ''
  });
  
  // Student modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: '',
    grade: 8,
    target_score: 450
  });
  const [addStudentForm, setAddStudentForm] = useState({
    full_name: '',
    email: '',
    password: '',
    grade: 8,
    target_score: 450
  });
  
  // Curriculum management states
  const [selectedGrade, setSelectedGrade] = useState<number>(8);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    color: '#3B82F6',
    icon: '📚',
    grade: 8
  });
  const [topicForm, setTopicForm] = useState({
    name: '',
    description: '',
    difficulty_level: 2,
    importance_level: 2,
    lgs_frequency: 0
  });

  // Library Management States
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category_id: '',
    total_pages: 0,
    cover_image: '',
    difficulty: 'Orta',
    age_range: '12-16',
    description: ''
  });
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    color: 'bg-purple-500',
    icon: '📖',
    order_index: 0
  });
  
  const router = useRouter();

  // Fetch students and videos from Supabase
  useEffect(() => {
    fetchStudents();
    fetchDailyVideos();
    fetchCurriculum();
    fetchLibraryData();
  }, []);

  // Fetch curriculum when grade changes
  useEffect(() => {
    fetchCurriculum();
  }, [selectedGrade]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      
      // Fetch profiles - Ignore RLS for now, use simple query
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_coins(total_coins)
        `)
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (profiles) {
        // Fetch additional data for each student
        const studentsWithStats = await Promise.all(
          profiles.map(async (profile) => {
            // Get total XP from study sessions
            const { data: sessions } = await supabase
              .from('study_sessions')
              .select('xp_earned')
              .eq('user_id', profile.id);
            
            const totalXP = sessions?.reduce((sum, s) => sum + s.xp_earned, 0) || 0;
            
            // Get quests completed
            const { data: quests } = await supabase
              .from('quests')
              .select('id')
              .eq('user_id', profile.id)
              .eq('status', 'completed');
            
            const questsCompleted = quests?.length || 0;
            
            // Get weekly questions
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            const { data: weeklySessions } = await supabase
              .from('study_sessions')
              .select('questions_solved')
              .eq('user_id', profile.id)
              .gte('completed_at', weekAgo.toISOString());
            
            const weeklyQuestions = weeklySessions?.reduce((sum, s) => sum + s.questions_solved, 0) || 0;
            
            // Get total coins
            const { data: coins } = await supabase
              .from('user_coins')
              .select('total_coins')
              .eq('user_id', profile.id)
              .single();
            
            return {
              ...profile,
              totalXP,
              questsCompleted,
              weeklyQuestions,
              totalCoins: coins?.total_coins || 0
            };
          })
        );
        
        setStudents(studentsWithStats);
      }
    } catch (error: any) {
      console.error('Error fetching students:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      alert(`Hata: ${error.message || 'Öğrenciler yüklenirken bir hata oluştu'}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_videos')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedVideos = data.map(video => ({
          id: video.id,
          date: video.date,
          title: video.title,
          videoId: video.video_id,
          description: video.description || '',
          isActive: video.is_active
        }));
        setDailyVideos(formattedVideos);
      }
    } catch (error) {
      console.error('Error fetching daily videos:', error);
    }
  };

  const fetchCurriculum = async () => {
    try {
      // Fetch subjects for selected grade
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*')
        .eq('grade', selectedGrade)
        .order('name');

      if (subjectsError) throw subjectsError;
      setSubjects(subjectsData || []);

      // Fetch all topics for these subjects
      if (subjectsData && subjectsData.length > 0) {
        const subjectIds = subjectsData.map(s => s.id);
        const { data: topicsData, error: topicsError } = await supabase
          .from('topics')
          .select('*')
          .in('subject_id', subjectIds)
          .order('name');

        if (topicsError) throw topicsError;
        setTopics(topicsData || []);
      } else {
        setTopics([]);
      }
    } catch (error) {
      console.error('Error fetching curriculum:', error);
    }
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setEditForm({
      full_name: student.full_name || '',
      email: student.email,
      grade: student.grade || 8,
      target_score: student.target_score || 450
    });
    setShowEditModal(true);
  };

  const handleDeleteStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleShowDetails = (student: Student) => {
    setSelectedStudent(student);
    setShowDetailsModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedStudent) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedStudent.id);
      
      if (error) throw error;
      
      // Refresh students list
      await fetchStudents();
      setShowDeleteModal(false);
      setSelectedStudent(null);
      alert('Öğrenci başarıyla silindi!');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Öğrenci silinirken bir hata oluştu!');
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          grade: editForm.grade,
          target_score: editForm.target_score,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedStudent.id);
      
      if (error) throw error;
      
      // Refresh students list
      await fetchStudents();
      setShowEditModal(false);
      setSelectedStudent(null);
      alert('Öğrenci bilgileri başarıyla güncellendi!');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Güncelleme sırasında bir hata oluştu!');
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 1. Supabase Auth ile kullanıcı oluştur
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: addStudentForm.email,
        password: addStudentForm.password,
        options: {
          data: {
            full_name: addStudentForm.full_name,
            role: 'student'
          }
        }
      });

      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Kullanıcı oluşturulamadı');
      }

      // 2. Profile oluştur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: addStudentForm.email,
          full_name: addStudentForm.full_name,
          role: 'student',
          grade: addStudentForm.grade,
          target_score: addStudentForm.target_score
        });

      if (profileError) throw profileError;

      // 3. User coins başlat
      const { error: coinsError } = await supabase
        .from('user_coins')
        .insert({
          user_id: authData.user.id,
          total_coins: 0,
          spent_coins: 0,
          earned_coins: 0
        });

      if (coinsError) console.warn('Coins oluşturulamadı:', coinsError);

      // Refresh students list
      await fetchStudents();
      setShowAddStudentModal(false);
      setAddStudentForm({
        full_name: '',
        email: '',
        password: '',
        grade: 8,
        target_score: 450
      });
      alert('Yeni öğrenci başarıyla eklendi!');
    } catch (error: any) {
      console.error('Error adding student:', error);
      alert(`Hata: ${error.message || 'Öğrenci eklenirken bir hata oluştu'}`);
    }
  };

  const handlePurchaseAction = (requestId: string, action: 'approved' | 'rejected') => {
    setPurchaseRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: action }
          : request
      )
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const extractVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : url;
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const videoId = extractVideoId(videoForm.videoId);
    
    try {
    if (editingVideo) {
        // Update existing video
        const { error } = await supabase
          .from('daily_videos')
          .update({
            date: videoForm.date,
            title: videoForm.title,
            video_id: videoId,
            description: videoForm.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingVideo.id);

        if (error) throw error;
    } else {
        // Insert new video
        const { error } = await supabase
          .from('daily_videos')
          .insert({
            date: videoForm.date,
            title: videoForm.title,
            video_id: videoId,
            description: videoForm.description,
            is_active: true
          });

        if (error) throw error;
      }

      // Reload videos
      await fetchDailyVideos();
    
    setShowVideoModal(false);
    setEditingVideo(null);
    setVideoForm({ date: '', title: '', videoId: '', description: '' });
      
      alert(editingVideo ? 'Video başarıyla güncellendi!' : 'Video başarıyla eklendi!');
    } catch (error: any) {
      console.error('Error saving video:', error);
      alert(`Hata: ${error.message || 'Video kaydedilirken bir hata oluştu'}`);
    }
  };

  const handleEditVideo = (video: DailyVideo) => {
    setEditingVideo(video);
    setVideoForm({
      date: video.date,
      title: video.title,
      videoId: video.videoId,
      description: video.description
    });
    setShowVideoModal(true);
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Bu videoyu silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('daily_videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      // Reload videos
      await fetchDailyVideos();
      alert('Video başarıyla silindi!');
    } catch (error: any) {
      console.error('Error deleting video:', error);
      alert(`Hata: ${error.message || 'Video silinirken bir hata oluştu'}`);
    }
  };

  // Curriculum handlers
  const handleSubjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingSubject) {
        const { error } = await supabase
          .from('subjects')
          .update(subjectForm)
          .eq('id', editingSubject.id);

        if (error) {
          console.error('Update error:', error);
          if (error.code === '23505') {
            throw new Error('Bu ders kodu zaten kullanılıyor. Lütfen farklı bir kod seçin.');
          }
          throw error;
        }
        alert('Ders başarıyla güncellendi!');
      } else {
        const { error } = await supabase
          .from('subjects')
          .insert(subjectForm);

        if (error) {
          console.error('Insert error:', error);
          if (error.code === '23505') {
            throw new Error('Bu ders kodu zaten kullanılıyor. Lütfen farklı bir kod seçin.');
          }
          throw error;
        }
        alert('Ders başarıyla eklendi!');
      }

      await fetchCurriculum();
      setShowSubjectModal(false);
      setEditingSubject(null);
      setSubjectForm({ name: '', code: '', color: '#3B82F6', icon: '📚', grade: selectedGrade });
    } catch (error: any) {
      console.error('Error saving subject:', error);
      alert(`Hata: ${error.message || 'Ders kaydedilirken bir hata oluştu'}`);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    console.log('🗑️ Ders silme işlemi başladı, ID:', subjectId);
    
    if (!confirm('Bu dersi ve tüm konularını silmek istediğinizden emin misiniz?')) {
      console.log('❌ Kullanıcı iptal etti');
      return;
    }
    
    console.log('✅ Kullanıcı onayladı, silme işlemi başlıyor...');
    
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', subjectId);

      if (error) {
        console.error('❌ Silme hatası:', error);
        throw error;
      }
      
      console.log('✅ Ders başarıyla silindi!');
      await fetchCurriculum();
      alert('Ders başarıyla silindi!');
    } catch (error: any) {
      console.error('Error deleting subject:', error);
      alert(`Hata: ${error.message || 'Ders silinirken bir hata oluştu'}`);
    }
  };

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject) {
      alert('Lütfen önce bir ders seçin!');
      return;
    }

    try {
      // Prepare data with proper null handling
      const topicData = {
        name: topicForm.name,
        description: topicForm.description || null,
        difficulty_level: topicForm.difficulty_level || 2,
        importance_level: topicForm.importance_level || 2,
        lgs_frequency: topicForm.lgs_frequency || 0
      };

      if (editingTopic) {
        const { error } = await supabase
          .from('topics')
          .update(topicData)
          .eq('id', editingTopic.id);

        if (error) {
          console.error('Update error details:', error);
          throw error;
        }
        alert('Konu başarıyla güncellendi!');
      } else {
        const { error } = await supabase
          .from('topics')
          .insert({
            ...topicData,
            subject_id: selectedSubject.id
          });

        if (error) {
          console.error('Insert error details:', error);
          throw error;
        }
        alert('Konu başarıyla eklendi!');
      }

      await fetchCurriculum();
      setShowTopicModal(false);
      setEditingTopic(null);
      setTopicForm({ name: '', description: '', difficulty_level: 2, importance_level: 2, lgs_frequency: 0 });
    } catch (error: any) {
      console.error('Error saving topic:', error);
      alert(`Hata: ${error.message || error.toString() || 'Konu kaydedilirken bir hata oluştu'}`);
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    console.log('🗑️ Konu silme işlemi başladı, ID:', topicId);
    
    if (!confirm('Bu konuyu silmek istediğinizden emin misiniz?')) {
      console.log('❌ Kullanıcı iptal etti');
      return;
    }
    
    console.log('✅ Kullanıcı onayladı, silme işlemi başlıyor...');
    
    try {
      const { error } = await supabase
        .from('topics')
        .delete()
        .eq('id', topicId);

      if (error) {
        console.error('❌ Silme hatası:', error);
        throw error;
      }
      
      console.log('✅ Konu başarıyla silindi!');
      await fetchCurriculum();
      alert('Konu başarıyla silindi!');
    } catch (error: any) {
      console.error('Error deleting topic:', error);
      alert(`Hata: ${error.message || 'Konu silinirken bir hata oluştu'}`);
    }
  };

  const getImportanceStars = (level: number) => {
    return '⭐'.repeat(level);
  };

  // ==========================================
  // Library Management Functions
  // ==========================================

  const fetchLibraryData = async () => {
    await Promise.all([fetchBooks(), fetchCategories()]);
  };

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*, category:book_categories(name, color, icon)')
        .order('title', { ascending: true });

      if (error) throw error;
      setBooks(data || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('book_categories')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBook) {
        // Update
        const { error } = await supabase
          .from('books')
          .update({
            title: bookForm.title,
            author: bookForm.author,
            category_id: bookForm.category_id,
            total_pages: bookForm.total_pages,
            cover_image: bookForm.cover_image,
            difficulty: bookForm.difficulty,
            age_range: bookForm.age_range,
            description: bookForm.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingBook.id);

        if (error) throw error;
        alert('Kitap başarıyla güncellendi!');
      } else {
        // Insert
        const { error } = await supabase
          .from('books')
          .insert({
            title: bookForm.title,
            author: bookForm.author,
            category_id: bookForm.category_id,
            total_pages: bookForm.total_pages,
            cover_image: bookForm.cover_image,
            difficulty: bookForm.difficulty,
            age_range: bookForm.age_range,
            description: bookForm.description,
            is_active: true
          });

        if (error) throw error;
        alert('Kitap başarıyla eklendi!');
      }

      setShowBookModal(false);
      setEditingBook(null);
      setBookForm({
        title: '',
        author: '',
        category_id: '',
        total_pages: 0,
        cover_image: '',
        difficulty: 'Orta',
        age_range: '12-16',
        description: ''
      });
      await fetchBooks();
    } catch (error: any) {
      console.error('Error saving book:', error);
      alert(`Hata: ${error.message || 'Kitap kaydedilirken bir hata oluştu'}`);
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      category_id: book.category_id,
      total_pages: book.total_pages,
      cover_image: book.cover_image,
      difficulty: book.difficulty,
      age_range: book.age_range,
      description: book.description
    });
    setShowBookModal(true);
  };

  const handleDeleteBook = async (bookId: string) => {
    if (!confirm('Bu kitabı silmek istediğinizden emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('books')
        .update({ is_active: false })
        .eq('id', bookId);

      if (error) throw error;
      
      alert('Kitap başarıyla silindi!');
      await fetchBooks();
    } catch (error: any) {
      console.error('Error deleting book:', error);
      alert(`Hata: ${error.message || 'Kitap silinirken bir hata oluştu'}`);
    }
  };

  const handleToggleBookActive = async (bookId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('books')
        .update({ is_active: !currentStatus })
        .eq('id', bookId);

      if (error) throw error;
      await fetchBooks();
    } catch (error) {
      console.error('Error toggling book status:', error);
    }
  };

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.weeklyQuestions && s.weeklyQuestions > 0).length;
  const pendingRequests = purchaseRequests.filter(r => r.status === 'pending').length;
  const totalQuestions = students.reduce((sum, student) => sum + (student.weeklyQuestions || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
              <i className="ri-settings-line text-white text-xl w-6 h-6 flex items-center justify-center"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Paneli</h1>
              <p className="text-gray-600">LGS Liga Yönetim Merkezi</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-logout-box-line mr-2 w-5 h-5 flex items-center justify-center"></i>
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="flex">
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {[
              { id: 'dashboard', name: 'Genel Bakış', icon: 'ri-dashboard-line' },
              { id: 'students', name: 'Öğrenci Listesi', icon: 'ri-user-line' },
              { id: 'curriculum', name: 'Müfredat Yönetimi', icon: 'ri-book-2-line' },
              { id: 'library', name: 'Kütüphane Yönetimi', icon: 'ri-book-open-line' },
              { id: 'purchases', name: 'Satın Alma İstekleri', icon: 'ri-shopping-cart-line' },
              { id: 'questions', name: 'Soru Havuzu', icon: 'ri-question-line' },
              { id: 'videos', name: 'Günlük Videolar', icon: 'ri-play-circle-line' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === item.id
                    ? 'bg-purple-50 text-purple-600 border border-purple-200'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <i className={`${item.icon} mr-3 w-5 h-5 flex items-center justify-center`}></i>
                {item.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-gray-900">Genel Bakış</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <i className="ri-user-line text-2xl text-blue-500 w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{totalStudents}</div>
                  <div className="text-sm text-gray-600">Toplam Öğrenci</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <i className="ri-pulse-line text-2xl text-green-500 w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{activeStudents}</div>
                  <div className="text-sm text-gray-600">Aktif Öğrenci</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <i className="ri-shopping-bag-line text-2xl text-orange-500 w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{pendingRequests}</div>
                  <div className="text-sm text-gray-600">Bekleyen İstek</div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <i className="ri-question-line text-2xl text-purple-500 w-8 h-8 flex items-center justify-center"></i>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{totalQuestions}</div>
                  <div className="text-sm text-gray-600">Bu Hafta Çözülen</div>
                </div>
              </div>

              {/* ... existing dashboard content ... */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">En Aktif Öğrenciler</h3>
                  <div className="space-y-4">
                    {students
                      .sort((a, b) => (b.weeklyQuestions || 0) - (a.weeklyQuestions || 0))
                      .slice(0, 5)
                      .map((student, index) => (
                      <div key={student.id} className="flex items-center space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{student.full_name || 'İsimsiz'}</p>
                          <p className="text-sm text-gray-600">{student.weeklyQuestions || 0} soru bu hafta</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{student.totalXP || 0} XP</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Son Satın Alma İstekleri</h3>
                  <div className="space-y-4">
                    {purchaseRequests.slice(0, 5).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{request.studentName}</p>
                          <p className="text-sm text-gray-600">{request.reward}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{request.coinCost} coin</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'approved' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status === 'pending' ? 'Bekliyor' :
                             request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Müfredat Yönetimi</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value={5}>5. Sınıf</option>
                    <option value={6}>6. Sınıf</option>
                    <option value={7}>7. Sınıf</option>
                    <option value={8}>8. Sınıf</option>
                  </select>
                  <button 
                    onClick={() => {
                      setSubjectForm({...subjectForm, grade: selectedGrade});
                      setShowSubjectModal(true);
                    }}
                    className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap flex items-center"
                  >
                    <i className="ri-add-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                    Ders Ekle
                  </button>
                </div>
              </div>
              
              {subjects.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-200">
                  <i className="ri-book-2-line text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Henüz {selectedGrade}. sınıf için ders eklenmemiş
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Başlamak için "Ders Ekle" butonuna tıklayın
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {subjects.map((subject) => {
                    const subjectTopics = topics.filter(t => t.subject_id === subject.id);
                    return (
                    <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl`} style={{backgroundColor: subject.color + '20'}}>
                            {subject.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{subject.name}</h3>
                            <p className="text-sm text-gray-600">{subject.code} • {subjectTopics.length} konu</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedSubject(subject);
                              setTopicForm({name: '', description: '', difficulty_level: 2, importance_level: 2, lgs_frequency: 0});
                              setShowTopicModal(true);
                            }}
                            className="text-green-600 hover:text-green-800 cursor-pointer p-2"
                            title="Konu Ekle"
                          >
                            <i className="ri-add-line w-5 h-5"></i>
                          </button>
                          <button
                            onClick={() => {
                              setEditingSubject(subject);
                              setSubjectForm({
                                name: subject.name,
                                code: subject.code,
                                color: subject.color,
                                icon: subject.icon,
                                grade: subject.grade
                              });
                              setShowSubjectModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 cursor-pointer p-2"
                            title="Düzenle"
                          >
                            <i className="ri-edit-line w-5 h-5"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(subject.id)}
                            className="text-red-600 hover:text-red-800 cursor-pointer p-2"
                            title="Sil"
                          >
                            <i className="ri-delete-bin-line w-5 h-5"></i>
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {subjectTopics.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">Henüz konu eklenmemiş</p>
                        ) : (
                          subjectTopics.map((topic) => (
                            <div key={topic.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <p className="font-medium text-gray-900">{topic.name}</p>
                                  <span className="text-yellow-500">{getImportanceStars(topic.importance_level)}</span>
                                </div>
                                {topic.description && (
                                  <p className="text-xs text-gray-600 mt-1">{topic.description}</p>
                                )}
                                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                  <span>Zorluk: {topic.difficulty_level}/5</span>
                                  {topic.lgs_frequency > 0 && (
                                    <span>LGS: ~{topic.lgs_frequency} soru/yıl</span>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <button
                                  onClick={() => {
                                    setSelectedSubject(subject);
                                    setEditingTopic(topic);
                                    setTopicForm({
                                      name: topic.name,
                                      description: topic.description || '',
                                      difficulty_level: topic.difficulty_level,
                                      importance_level: topic.importance_level,
                                      lgs_frequency: topic.lgs_frequency
                                    });
                                    setShowTopicModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer p-1"
                                >
                                  <i className="ri-edit-line w-4 h-4"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteTopic(topic.id)}
                                  className="text-red-600 hover:text-red-800 cursor-pointer p-1"
                                >
                                  <i className="ri-delete-bin-line w-4 h-4"></i>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Günlük Motivasyon Videoları</h2>
                <button 
                  onClick={() => setShowVideoModal(true)}
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap flex items-center"
                >
                  <i className="ri-add-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  Video Ekle
                </button>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Tarih</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Video</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Başlık</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Durum</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {dailyVideos.map((video) => (
                        <tr key={video.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(video.date).toLocaleDateString('tr-TR')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden">
                              <img 
                                src={`https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-gray-900">{video.title}</p>
                              <p className="text-sm text-gray-600">{video.description}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              video.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {video.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditVideo(video)}
                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              >
                                <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(video.id)}
                                className="text-red-600 hover:text-red-800 cursor-pointer"
                              >
                                <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ... existing tabs content ... */}
          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Öğrenci Listesi</h2>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setShowAddStudentModal(true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors cursor-pointer flex items-center"
                  >
                    <i className="ri-user-add-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                    Yeni Öğrenci Ekle
                  </button>
                  <button 
                    onClick={() => fetchStudents()}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer flex items-center"
                  >
                    <i className="ri-refresh-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                    Yenile
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                  <p className="mt-4 text-gray-600">Öğrenciler yükleniyor...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <i className="ri-user-line text-6xl text-gray-300 w-24 h-24 flex items-center justify-center mx-auto mb-4"></i>
                  <p className="text-gray-600">Henüz öğrenci kaydı bulunmuyor.</p>
                </div>
              ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Öğrenci</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Sınıf</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Hedef</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">XP</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Görevler</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Bu Hafta</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Coin</th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {students.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                                <p className="font-medium text-gray-900">{student.full_name || 'İsimsiz'}</p>
                              <p className="text-sm text-gray-600">{student.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {student.grade || '-'}. Sınıf
                            </span>
                          </td>
                            <td className="px-6 py-4 text-sm text-gray-900">{student.target_score || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{student.totalXP || 0}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{student.questsCompleted || 0}</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{student.weeklyQuestions || 0} soru</td>
                            <td className="px-6 py-4 text-sm text-gray-900">{student.totalCoins || 0}</td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleShowDetails(student)}
                                  className="text-purple-600 hover:text-purple-800 cursor-pointer"
                                  title="Detaylar"
                                >
                                  <i className="ri-eye-line w-5 h-5 flex items-center justify-center"></i>
                                </button>
                                <button
                                  onClick={() => handleEditStudent(student)}
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                  title="Düzenle"
                                >
                                  <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(student)}
                                  className="text-red-600 hover:text-red-800 cursor-pointer"
                                  title="Sil"
                                >
                                  <i className="ri-delete-bin-line w-5 h-5 flex items-center justify-center"></i>
                                </button>
                              </div>
                            </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              )}
            </div>
          )}

          {/* Library Management Tab */}
          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Kütüphane Yönetimi</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingBook(null);
                      setBookForm({
                        title: '',
                        author: '',
                        category_id: '',
                        total_pages: 0,
                        cover_image: '',
                        difficulty: 'Orta',
                        age_range: '12-16',
                        description: ''
                      });
                      setShowBookModal(true);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Yeni Kitap Ekle
                  </button>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center"
                  >
                    <i className="ri-folder-add-line mr-2"></i>
                    Kategori Yönet
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <i className="ri-book-line text-2xl text-blue-500"></i>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">Kitap</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{books.length}</div>
                  <div className="text-sm text-gray-600">Toplam Kitap</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <i className="ri-checkbox-circle-line text-2xl text-green-500"></i>
                    <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Aktif</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{books.filter(b => b.is_active).length}</div>
                  <div className="text-sm text-gray-600">Aktif Kitap</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <i className="ri-folder-line text-2xl text-purple-500"></i>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">Kategori</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{categories.length}</div>
                  <div className="text-sm text-gray-600">Kategori</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <i className="ri-eye-off-line text-2xl text-gray-400"></i>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">Pasif</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{books.filter(b => !b.is_active).length}</div>
                  <div className="text-sm text-gray-600">Pasif Kitap</div>
                </div>
              </div>

              {/* Books Table */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kapak</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kitap Adı</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Yazar</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Kategori</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Sayfa</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Zorluk</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Yaş</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">Durum</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {books.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="text-center py-8 text-gray-500">
                            Henüz kitap yok. İlk kitabı ekleyin!
                          </td>
                        </tr>
                      ) : (
                        books.map((book) => (
                          <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              <img 
                                src={book.cover_image || '/placeholder-book.jpg'} 
                                alt={book.title}
                                className="w-12 h-16 object-cover rounded"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-medium text-gray-900">{book.title}</p>
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-600">{book.author}</td>
                            <td className="py-3 px-4">
                              {book.category && (
                                <span className={`${book.category.color} text-white text-xs px-2 py-1 rounded-full`}>
                                  {book.category.icon} {book.category.name}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center text-sm text-gray-900">{book.total_pages}</td>
                            <td className="py-3 px-4 text-center text-sm text-gray-700">{book.difficulty}</td>
                            <td className="py-3 px-4 text-center text-sm text-gray-700">{book.age_range}</td>
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleToggleBookActive(book.id, book.is_active)}
                                className={`text-xs px-3 py-1 rounded-full font-medium ${
                                  book.is_active 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {book.is_active ? 'Aktif' : 'Pasif'}
                              </button>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleEditBook(book)}
                                  className="text-blue-600 hover:text-blue-700 p-1"
                                  title="Düzenle"
                                >
                                  <i className="ri-edit-line"></i>
                                </button>
                                <button
                                  onClick={() => handleDeleteBook(book.id)}
                                  className="text-red-600 hover:text-red-700 p-1"
                                  title="Sil"
                                >
                                  <i className="ri-delete-bin-line"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Categories Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Kategoriler</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`${category.color} text-white p-4 rounded-xl text-center`}
                    >
                      <div className="text-3xl mb-2">{category.icon}</div>
                      <div className="font-semibold text-sm">{category.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Satın Alma İstekleri</h2>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="space-y-4">
                    {purchaseRequests.map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-6 border border-gray-200 rounded-xl">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-3">
                            <h3 className="font-semibold text-gray-900">{request.studentName}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {request.status === 'pending' ? 'Bekliyor' :
                               request.status === 'approved' ? 'Onaylandı' : 'Reddedildi'}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{request.reward}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{request.coinCost} coin</span>
                            <span>•</span>
                            <span>{request.requestDate}</span>
                          </div>
                        </div>
                        
                        {request.status === 'pending' && (
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handlePurchaseAction(request.id, 'approved')}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Onayla
                            </button>
                            <button
                              onClick={() => handlePurchaseAction(request.id, 'rejected')}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              Reddet
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Soru Havuzu Yönetimi</h2>
                <button className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap">
                  Yeni Soru Ekle
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { subject: 'Matematik', total: 1250, recent: 45, color: 'blue' },
                  { subject: 'Fen Bilimleri', total: 980, recent: 32, color: 'green' },
                  { subject: 'Türkçe', total: 875, recent: 28, color: 'purple' },
                  { subject: 'Sosyal Bilgiler', total: 650, recent: 18, color: 'orange' }
                ].map((subject) => (
                  <div key={subject.subject} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <i className={`ri-book-line text-2xl text-${subject.color}-500 w-8 h-8 flex items-center justify-center`}></i>
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        +{subject.recent} bu ay
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{subject.subject}</h3>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{subject.total}</div>
                    <div className="text-sm text-gray-600">Toplam soru</div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Son Eklenen Sorular</h3>
                <div className="space-y-4">
                  {[
                    { subject: 'Matematik', question: 'İki basamaklı bir sayının rakamları toplamı 12, rakamları farkı 4 ise...', date: '15 Ocak 2024' },
                    { subject: 'Fen', question: 'Canlıların çevresel koşullara uyum sağlama özelliğine ne denir?', date: '14 Ocak 2024' },
                    { subject: 'Türkçe', question: 'Aşağıdaki cümlelerin hangisinde mecaz anlam kullanılmıştır?', date: '13 Ocak 2024' },
                    { subject: 'Sosyal', question: 'Osmanlı İmparatorluğu\'nun kuruluş dönemi hangi yüzyılda...', date: '12 Ocak 2024' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {item.subject}
                      </span>
                      <div className="flex-1">
                        <p className="text-gray-900 text-sm">{item.question}</p>
                        <p className="text-xs text-gray-600 mt-1">{item.date}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                        <i className="ri-edit-line w-5 h-5 flex items-center justify-center"></i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingVideo ? 'Video Düzenle' : 'Yeni Video Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setEditingVideo(null);
                  setVideoForm({ date: '', title: '', videoId: '', description: '' });
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <form onSubmit={handleVideoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarih
                </label>
                <input
                  type="date"
                  value={videoForm.date}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Başlığı
                </label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Motivasyon video başlığı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL veya Video ID
                </label>
                <input
                  type="text"
                  value={videoForm.videoId}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, videoId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="https://youtube.com/watch?v=... veya video ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={videoForm.description}
                  onChange={(e) => setVideoForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Video hakkında kısa açıklama"
                  required
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {editingVideo ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoModal(false);
                    setEditingVideo(null);
                    setVideoForm({ date: '', title: '', videoId: '', description: '' });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingSubject ? 'Ders Düzenle' : 'Yeni Ders Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowSubjectModal(false);
                  setEditingSubject(null);
                  setSubjectForm({ name: '', code: '', color: '#3B82F6', icon: '📚', grade: selectedGrade });
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6"></i>
              </button>
            </div>

            <form onSubmit={handleSubjectSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ders Adı
                </label>
                <input
                  type="text"
                  value={subjectForm.name}
                  onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Matematik, Türkçe, vb."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ders Kodu
                </label>
                <input
                  type="text"
                  value={subjectForm.code}
                  onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="MAT8, TUR8, vb."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Renk
                  </label>
                  <input
                    type="color"
                    value={subjectForm.color}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    İkon (Emoji)
                  </label>
                  <input
                    type="text"
                    value={subjectForm.icon}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-2xl text-center"
                    placeholder="📚"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {editingSubject ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSubjectModal(false);
                    setEditingSubject(null);
                    setSubjectForm({ name: '', code: '', color: '#3B82F6', icon: '📚', grade: selectedGrade });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topic Modal */}
      {showTopicModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingTopic ? 'Konu Düzenle' : 'Yeni Konu Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowTopicModal(false);
                  setEditingTopic(null);
                  setTopicForm({ name: '', description: '', difficulty_level: 2, importance_level: 2, lgs_frequency: 0 });
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6"></i>
              </button>
            </div>

            <form onSubmit={handleTopicSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konu Adı
                </label>
                <input
                  type="text"
                  value={topicForm.name}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Çarpanlar ve Katlar, Paragraf Anlama, vb."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={topicForm.description}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  rows={2}
                  placeholder="Kısa açıklama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zorluk Seviyesi (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={topicForm.difficulty_level}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, difficulty_level: parseInt(e.target.value) || 2 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Önem Derecesi (⭐)
                </label>
                <select
                  value={topicForm.importance_level}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, importance_level: parseInt(e.target.value) || 2 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value={1}>⭐ Az Önemli (0-1 soru/yıl)</option>
                  <option value={2}>⭐⭐ Orta Önemli (2-3 soru/yıl)</option>
                  <option value={3}>⭐⭐⭐ Çok Önemli (3+ soru/yıl)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LGS Sıklığı (ortalama soru/yıl)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={topicForm.lgs_frequency}
                  onChange={(e) => setTopicForm(prev => ({ ...prev, lgs_frequency: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="2.5"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer whitespace-nowrap"
                >
                  {editingTopic ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowTopicModal(false);
                    setEditingTopic(null);
                    setTopicForm({ name: '', description: '', difficulty_level: 2, importance_level: 2, lgs_frequency: 0 });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer whitespace-nowrap"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Öğrenci Düzenle</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedStudent(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <form onSubmit={handleUpdateStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Email değiştirilemez</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sınıf
                </label>
                <select
                  value={editForm.grade}
                  onChange={(e) => setEditForm(prev => ({ ...prev, grade: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value={5}>5. Sınıf</option>
                  <option value={6}>6. Sınıf</option>
                  <option value={7}>7. Sınıf</option>
                  <option value={8}>8. Sınıf</option>
                  <option value={9}>9. Sınıf</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Puan
                </label>
                <input
                  type="number"
                  value={editForm.target_score}
                  onChange={(e) => setEditForm(prev => ({ ...prev, target_score: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  min={0}
                  max={500}
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer"
                >
                  Güncelle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedStudent(null);
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Student Modal */}
      {showDeleteModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-red-600">Öğrenci Sil</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedStudent(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800 font-medium mb-2">⚠️ Dikkat!</p>
                <p className="text-red-700 text-sm">
                  Bu öğrenciyi silmek üzeresiniz. Bu işlem geri alınamaz ve öğrencinin tüm verileri (görevler, sınavlar, çalışma geçmişi) silinecektir.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Silinecek Öğrenci:</p>
                <p className="font-medium text-gray-900">{selectedStudent.full_name}</p>
                <p className="text-sm text-gray-600">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors cursor-pointer"
              >
                Evet, Sil
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedStudent(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Yeni Öğrenci Ekle</h3>
              <button
                onClick={() => {
                  setShowAddStudentModal(false);
                  setAddStudentForm({
                    full_name: '',
                    email: '',
                    password: '',
                    grade: 8,
                    target_score: 450
                  });
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad Soyad *
                </label>
                <input
                  type="text"
                  value={addStudentForm.full_name}
                  onChange={(e) => setAddStudentForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Örn: Zeynep Ünsal"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={addStudentForm.email}
                  onChange={(e) => setAddStudentForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="örnek@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Şifre *
                </label>
                <input
                  type="password"
                  value={addStudentForm.password}
                  onChange={(e) => setAddStudentForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="En az 6 karakter"
                  minLength={6}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 karakter</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sınıf
                </label>
                <select
                  value={addStudentForm.grade}
                  onChange={(e) => setAddStudentForm(prev => ({ ...prev, grade: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value={5}>5. Sınıf</option>
                  <option value={6}>6. Sınıf</option>
                  <option value={7}>7. Sınıf</option>
                  <option value={8}>8. Sınıf</option>
                  <option value={9}>9. Sınıf</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hedef Puan
                </label>
                <input
                  type="number"
                  value={addStudentForm.target_score}
                  onChange={(e) => setAddStudentForm(prev => ({ ...prev, target_score: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min={0}
                  max={500}
                  placeholder="450"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                >
                  Öğrenci Ekle
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStudentModal(false);
                    setAddStudentForm({
                      full_name: '',
                      email: '',
                      password: '',
                      grade: 8,
                      target_score: 450
                    });
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Öğrenci Detayları</h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedStudent(null);
                }}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <i className="ri-close-line w-6 h-6 flex items-center justify-center"></i>
              </button>
            </div>

            <div className="space-y-6">
              {/* Öğrenci Bilgileri */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {selectedStudent.full_name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{selectedStudent.full_name || 'İsimsiz'}</h4>
                    <p className="text-gray-600">{selectedStudent.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Sınıf</p>
                    <p className="font-medium text-gray-900">{selectedStudent.grade || '-'}. Sınıf</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">Hedef Puan</p>
                    <p className="font-medium text-gray-900">{selectedStudent.target_score || '-'}</p>
                  </div>
                </div>
              </div>

              {/* İstatistikler */}
              <div>
                <h4 className="font-bold text-gray-900 mb-4">📊 Genel İstatistikler</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">Toplam XP</p>
                    <p className="text-2xl font-bold text-blue-900">{selectedStudent.totalXP || 0}</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-600 mb-1">Tamamlanan Görev</p>
                    <p className="text-2xl font-bold text-green-900">{selectedStudent.questsCompleted || 0}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-orange-600 mb-1">Bu Hafta Soru</p>
                    <p className="text-2xl font-bold text-orange-900">{selectedStudent.weeklyQuestions || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <p className="text-sm text-purple-600 mb-1">Toplam Coin</p>
                    <p className="text-2xl font-bold text-purple-900">{selectedStudent.totalCoins || 0}</p>
                  </div>
                </div>
              </div>

              {/* Kayıt Tarihi */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Kayıt Tarihi</p>
                <p className="font-medium text-gray-900">
                  {new Date(selectedStudent.created_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* İşlem Butonları */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEditStudent(selectedStudent);
                  }}
                  className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors cursor-pointer flex items-center justify-center"
                >
                  <i className="ri-edit-line mr-2 w-5 h-5 flex items-center justify-center"></i>
                  Düzenle
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingBook ? 'Kitap Düzenle' : 'Yeni Kitap Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowBookModal(false);
                  setEditingBook(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kitap Adı <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yazar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bookForm.category_id}
                    onChange={(e) => setBookForm({ ...bookForm, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Kategori Seçin</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Toplam Sayfa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={bookForm.total_pages}
                    onChange={(e) => setBookForm({ ...bookForm, total_pages: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zorluk <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bookForm.difficulty}
                    onChange={(e) => setBookForm({ ...bookForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Kolay">⭐ Kolay</option>
                    <option value="Orta">⭐⭐ Orta</option>
                    <option value="Zor">⭐⭐⭐ Zor</option>
                    <option value="Çok Zor">⭐⭐⭐⭐ Çok Zor</option>
                    <option value="Uzman">⭐⭐⭐⭐⭐ Uzman</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yaş Aralığı <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={bookForm.age_range}
                    onChange={(e) => setBookForm({ ...bookForm, age_range: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="6-10">6-10 yaş</option>
                    <option value="8-12">8-12 yaş</option>
                    <option value="10-14">10-14 yaş</option>
                    <option value="12-16">12-16 yaş</option>
                    <option value="14-18">14-18 yaş</option>
                    <option value="16+">16+ yaş</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kapak Resmi URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  value={bookForm.cover_image}
                  onChange={(e) => setBookForm({ ...bookForm, cover_image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  placeholder="Kitap hakkında kısa bir açıklama yazın..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookModal(false);
                    setEditingBook(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {editingBook ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
