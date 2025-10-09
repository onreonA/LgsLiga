"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
  test_accuracy?: number;
  exam_accuracy?: number;
}

interface MonthPlanning {
  month: number;
  topics: Topic[];
}

const MONTHS = [
  { id: 10, name: "Ekim", color: "from-orange-400 to-orange-600" },
  { id: 11, name: "Kasım", color: "from-yellow-400 to-yellow-600" },
  { id: 12, name: "Aralık", color: "from-blue-400 to-blue-600" },
  { id: 1, name: "Ocak", color: "from-purple-400 to-purple-600" },
  { id: 2, name: "Şubat", color: "from-pink-400 to-pink-600" },
  { id: 3, name: "Mart", color: "from-green-400 to-green-600" },
  { id: 4, name: "Nisan", color: "from-cyan-400 to-cyan-600" },
  { id: 5, name: "Mayıs", color: "from-emerald-400 to-emerald-600" },
  { id: 6, name: "Haziran", color: "from-lime-400 to-lime-600" },
];

// Topic Card Component
function TopicCard({
  topic,
  isDragging,
}: {
  topic: Topic;
  isDragging?: boolean;
}) {
  const getImportanceStars = (level: number) => "⭐".repeat(level);

  return (
    <div
      className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-gray-900 text-sm flex-1">
          {topic.name}
        </h4>
        <span className="text-yellow-500 text-xs ml-2">
          {getImportanceStars(topic.importance_level)}
        </span>
      </div>
      {topic.description && (
        <p className="text-xs text-gray-600 mb-2">{topic.description}</p>
      )}
      <div className="flex items-center space-x-2">
        {topic.test_accuracy !== undefined && (
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Test</span>
              <span className="text-xs font-medium text-blue-600">
                {topic.test_accuracy}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all"
                style={{ width: `${topic.test_accuracy}%` }}
              ></div>
            </div>
          </div>
        )}
        {topic.exam_accuracy !== undefined && (
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Deneme</span>
              <span className="text-xs font-medium text-green-600">
                {topic.exam_accuracy}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all"
                style={{ width: `${topic.exam_accuracy}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Draggable Topic Card
function DraggableTopic({ topic }: { topic: Topic }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: topic.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TopicCard topic={topic} isDragging={isDragging} />
    </div>
  );
}

// Droppable Month Container
function MonthContainer({
  month,
  topics,
  onDrop,
}: {
  month: (typeof MONTHS)[0];
  topics: Topic[];
  onDrop: (topicId: string, monthId: number) => void;
}) {
  const { setNodeRef } = useSortable({
    id: `month-${month.id}`,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className={`bg-gradient-to-r ${month.color} p-4`}>
        <h3 className="text-white font-bold text-lg">{month.name}</h3>
        <p className="text-white text-sm opacity-90">{topics.length} konu</p>
      </div>
      <div className="p-4 min-h-[120px] space-y-2">
        {topics.length === 0 ? (
          <div className="text-center py-8">
            <i className="ri-drag-drop-line text-4xl text-gray-300"></i>
            <p className="text-sm text-gray-500 mt-2">Konu sürükleyin</p>
          </div>
        ) : (
          <SortableContext
            items={topics.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            {topics.map((topic) => (
              <DraggableTopic key={topic.id} topic={topic} />
            ))}
          </SortableContext>
        )}
      </div>
    </div>
  );
}

export default function BigPicturePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userGrade, setUserGrade] = useState<number>(8);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allTopics, setAllTopics] = useState<Topic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [unplannedTopics, setUnplannedTopics] = useState<Topic[]>([]);
  const [monthlyPlan, setMonthlyPlan] = useState<Record<number, Topic[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        console.error("❌ No session found, redirecting to login");
        router.push("/");
        return;
      }

      console.log("✅ User authenticated:", session.user.email);
      setUser(session.user);

      // Get user grade
      const { data: profile } = await supabase
        .from("profiles")
        .select("grade")
        .eq("id", session.user.id)
        .single();

      setUserGrade(profile?.grade || 8);

      // Now fetch data
      fetchData(session.user.id, profile?.grade || 8);
    } catch (error) {
      console.error("Auth error:", error);
      router.push("/");
    }
  };

  useEffect(() => {
    if (selectedSubject) {
      filterTopicsBySubject();
    }
  }, [selectedSubject, allTopics]);

  const fetchData = async (userId: string, grade: number) => {
    try {
      setLoading(true);
      console.log("🎓 User grade:", grade);

      // Fetch subjects for user's grade
      const { data: subjectsData, error: subjectsError } = await supabase
        .from("subjects")
        .select("*")
        .eq("grade", grade)
        .order("name");

      if (subjectsError) {
        console.error("❌ Subjects error:", subjectsError);
      }

      console.log(
        "📚 Subjects found:",
        subjectsData?.length || 0,
        subjectsData,
      );
      setSubjects(subjectsData || []);

      // Fetch all topics for these subjects
      if (subjectsData && subjectsData.length > 0) {
        const subjectIds = subjectsData.map((s) => s.id);
        const { data: topicsData } = await supabase
          .from("topics")
          .select("*")
          .in("subject_id", subjectIds)
          .order("name");

        setAllTopics(topicsData || []);

        // Fetch user's planning
        const { data: planningData } = await supabase
          .from("user_topic_planning")
          .select("*")
          .eq("user_id", userId)
          .eq("planned_year", 2025);

        // Organize topics by month
        const monthlyTopics: Record<number, Topic[]> = {};
        MONTHS.forEach((m) => {
          monthlyTopics[m.id] = [];
        });

        if (planningData && topicsData) {
          planningData.forEach((plan) => {
            const topic = topicsData.find((t) => t.id === plan.topic_id);
            if (topic && plan.planned_month >= 1 && plan.planned_month <= 12) {
              monthlyTopics[plan.planned_month] =
                monthlyTopics[plan.planned_month] || [];
              monthlyTopics[plan.planned_month].push({
                ...topic,
                test_accuracy: plan.test_accuracy,
                exam_accuracy: plan.exam_accuracy,
              });
            }
          });
        }

        setMonthlyPlan(monthlyTopics);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTopicsBySubject = () => {
    if (!selectedSubject) {
      setUnplannedTopics([]);
      return;
    }

    // Get all topics for selected subject that are not planned yet
    const plannedTopicIds = new Set(
      Object.values(monthlyPlan)
        .flat()
        .map((t) => t.id),
    );

    const filtered = allTopics.filter(
      (topic) =>
        topic.subject_id === selectedSubject && !plannedTopicIds.has(topic.id),
    );

    setUnplannedTopics(filtered);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const topicId = active.id as string;
    const overId = over.id as string;

    // Check if dropped on a month container
    const monthMatch = overId.match(/^month-(\d+)$/);
    if (monthMatch) {
      const monthId = parseInt(monthMatch[1]);
      await moveTopic(topicId, monthId);
    } else if (overId === "unplanned") {
      await removeTopic(topicId);
    }
  };

  const moveTopic = async (topicId: string, monthId: number) => {
    if (!user) return;

    try {
      const topic = allTopics.find((t) => t.id === topicId);
      if (!topic) return;

      // Remove from current month
      const newMonthlyPlan = { ...monthlyPlan };
      Object.keys(newMonthlyPlan).forEach((key) => {
        newMonthlyPlan[parseInt(key)] = newMonthlyPlan[parseInt(key)].filter(
          (t) => t.id !== topicId,
        );
      });

      // Add to new month
      newMonthlyPlan[monthId] = [...(newMonthlyPlan[monthId] || []), topic];
      setMonthlyPlan(newMonthlyPlan);

      // Update in database
      const { error } = await supabase.from("user_topic_planning").upsert(
        {
          user_id: user.id,
          topic_id: topicId,
          planned_month: monthId,
          planned_year: 2025,
        },
        {
          onConflict: "user_id,topic_id,planned_month,planned_year",
        },
      );

      if (error) throw error;

      // Update unplanned topics
      setUnplannedTopics(unplannedTopics.filter((t) => t.id !== topicId));
    } catch (error) {
      console.error("Error moving topic:", error);
      alert("Konu taşınırken bir hata oluştu!");
    }
  };

  const removeTopic = async (topicId: string) => {
    if (!user) return;

    try {
      // Find the topic in allTopics (more reliable than searching monthlyPlan)
      const topicToRemove = allTopics.find((t) => t.id === topicId);

      // Remove from monthly plan
      const newMonthlyPlan = { ...monthlyPlan };
      Object.keys(newMonthlyPlan).forEach((key) => {
        newMonthlyPlan[parseInt(key)] = newMonthlyPlan[parseInt(key)].filter(
          (t) => t.id !== topicId,
        );
      });

      setMonthlyPlan(newMonthlyPlan);

      // Delete from database
      await supabase
        .from("user_topic_planning")
        .delete()
        .eq("user_id", user.id)
        .eq("topic_id", topicId);

      // Add back to unplanned if same subject
      if (
        topicToRemove &&
        selectedSubject &&
        topicToRemove.subject_id === selectedSubject
      ) {
        setUnplannedTopics([...unplannedTopics, topicToRemove]);
      }
    } catch (error) {
      console.error("Error removing topic:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const activeTopic = activeId
    ? allTopics.find((t) => t.id === activeId)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Büyük Resim</h1>
          <p className="text-gray-600">Yıllık çalışma planınızı oluşturun</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Subject & Topics */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Ders Konuları
              </h2>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 mb-4"
              >
                <option value="">Ders Seçin</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.icon} {subject.name}
                  </option>
                ))}
              </select>

              <div
                id="unplanned"
                className="space-y-2 max-h-[600px] overflow-y-auto"
              >
                <SortableContext
                  items={unplannedTopics.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {unplannedTopics.length === 0 ? (
                    <div className="text-center py-8">
                      <i className="ri-checkbox-circle-line text-4xl text-gray-300"></i>
                      <p className="text-sm text-gray-500 mt-2">
                        {selectedSubject
                          ? "Tüm konular planlandı"
                          : "Önce bir ders seçin"}
                      </p>
                    </div>
                  ) : (
                    unplannedTopics.map((topic) => (
                      <DraggableTopic key={topic.id} topic={topic} />
                    ))
                  )}
                </SortableContext>
              </div>
            </div>
          </div>

          {/* Right Panel - Monthly Calendar */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MONTHS.map((month) => (
                <MonthContainer
                  key={month.id}
                  month={month}
                  topics={monthlyPlan[month.id] || []}
                  onDrop={moveTopic}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeTopic ? <TopicCard topic={activeTopic} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}
