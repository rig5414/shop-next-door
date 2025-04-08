"use client";

import React, { useEffect, useState, useRef } from "react";
import {
    Chart,
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    Filler,
    Scale,
    CoreScaleOptions,
    Tick
} from "chart.js";
import { useRouter } from "next/navigation";
import { fetchInsights } from "../../../lib/fetchInsights";

// Register Chart.js components
ChartJS.register(BarElement, LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler);

interface SalesData {
    labels: string[];
    datasets: {
        type: 'bar' | 'line';
        label: string;
        data: number[];
        backgroundColor?: string | string[];
        borderColor: string | string[];
        borderWidth: number;
        fill?: boolean | string;
        tension?: number;
        yAxisID?: string;
        pointRadius?: number;
    }[];
}

// Utility function to combine class names (replacement for "@/lib/utils")
const cn = (...classes: string[]): string => {
    return classes.filter(Boolean).join(' ');
};

const SalesChart = ({ className = "" }) => {
    const router = useRouter();
    const [salesData, setSalesData] = useState<SalesData>({
        labels: [],
        datasets: [],
    });
    const [fetchedData, setFetchedData] = useState<any>(null);
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);
    const [chartInitialized, setChartInitialized] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const insights = await fetchInsights();
                setFetchedData(insights);
            } catch (error) {
                console.error("Error fetching sales data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (!fetchedData) return;

        let labels: string[] = [];
        let totalInvoiced: number[] = [];
        let totalCashedIn: number[] = [];
        let totalCashedInPercent: number[] = [];

        if (fetchedData.sales && Array.isArray(fetchedData.sales)) {
            labels = fetchedData.sales.map((sale: any) => {
                const date = new Date(sale.date);
                return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString("en-US", { month: 'short', year: 'numeric' });
            });
            totalInvoiced = fetchedData.sales.map((sale: any) => sale.total);
            totalCashedIn = fetchedData.sales.map((sale: any) => {
                return sale.total * 0.8;
            });
            totalCashedInPercent = totalInvoiced.map((invoiced, index) => {
                return totalCashedIn[index] / invoiced * 100;
            });
        } else {
            labels = [];
            totalInvoiced = [];
            totalCashedIn = [];
            totalCashedInPercent = [];
        }

        setSalesData({
            labels,
            datasets: [
                {
                    type: "bar",
                    label: "Total Invoiced (€)",
                    data: totalInvoiced,
                    backgroundColor: '#60a5fa',
                    borderColor: '#60a5fa',
                    borderWidth: 2,
                    yAxisID: 'y-left'
                },
                {
                    type: "bar",
                    label: "Total Cashed in (€)",
                    data: totalCashedIn,
                    backgroundColor: '#10b981',
                    borderColor: '#10b981',
                    borderWidth: 2,
                    yAxisID: 'y-left'
                },
                {
                    type: "line",
                    label: "Total Cashed in (%)",
                    data: totalCashedInPercent,
                    borderColor: '#f59e0b',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.4,
                    yAxisID: 'y-right',
                    pointRadius: 0
                }
            ],
        });
    }, [fetchedData]);

    useEffect(() => {
        const chartCtx = chartRef.current;
        if (chartCtx && salesData) {
            if (!chartInitialized) {
                try {
                    chartInstance.current = new Chart(chartCtx, {
                        type: 'bar',
                        data: salesData,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Sales History',
                                    color: '#fff',
                                    font: {
                                        size: 16
                                    }
                                },
                                legend: {
                                    position: 'bottom',
                                    labels: {
                                        color: '#fff',
                                        usePointStyle: true,
                                        font: {
                                            size: 12
                                        }
                                    },
                                },
                                tooltip: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    titleColor: '#fff',
                                    bodyColor: '#fff',
                                    borderColor: '#4a5568',
                                    borderWidth: 1,
                                    displayColors: true,
                                    callbacks: {
                                        label: (context) => {
                                            let label = context.dataset.label || '';
                                            if (label) {
                                                label += ': ';
                                            }
                                            if (context.parsed.y !== null) {
                                                const value = context.parsed.y;
                                                label += context.dataset.label?.includes('%')
                                                    ? (typeof value === 'number' ? value.toFixed(2) + '%' : '0%')
                                                    : (typeof value === 'number'
                                                        ? value.toLocaleString('en-US', {
                                                            style: 'currency',
                                                            currency: 'EUR'
                                                        })
                                                        : '0');
                                            }
                                            return label;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    type: 'category',
                                    ticks: {
                                        color: '#fff',
                                        font: {
                                            size: 12
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(255,255,255,0.1)'
                                    }
                                },
                                'y-left': {
                                    position: 'left',
                                    ticks: {
                                        color: '#fff',
                                        callback: (value) =>
                                            typeof value === 'number'
                                                ? value.toLocaleString('en-US', {
                                                    style: 'currency',
                                                    currency: 'EUR',
                                                })
                                                : '',
                                        font: {
                                            size: 12
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(255,255,255,0.1)'
                                    }
                                },
                                'y-right': {
                                    position: 'right',
                                    ticks: {
                                        color: '#fff',
                                        callback: (value) =>
                                            typeof value === 'number' ? value.toFixed(0) + '%' : '',
                                        font: {
                                            size: 12
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(255,255,255,0.1)'
                                    },
                                    display: true
                                }
                            },
                        },
                    });
                    setChartInitialized(true);
                }
                catch (e) {
                    console.error("CHART INITIALIZATION ERROR", e);
                }
            } else if (chartInstance.current) {
                chartInstance.current.data = salesData;
                chartInstance.current.update();
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [salesData, chartInitialized]);


    return (
        <div className={cn(
            "bg-gray-800 p-6 rounded-xl shadow-lg",
            "cursor-pointer hover:shadow-xl transition-shadow",
            className
        )}>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-white text-2xl font-semibold">Sales History</h2>
            </div>
            <div className="h-[350px]">
                <canvas ref={chartRef} />
            </div>
            {salesData.labels.length === 0 && (
                <p className="text-gray-400 text-sm text-center mt-4">No sales data available.</p>
            )}
        </div>
    );
};

export default SalesChart;

