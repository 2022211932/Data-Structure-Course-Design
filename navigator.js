// 故宫博物院导航系统 - 高德地图JS API实现
class MapNavigator {
    constructor() {
        // 初始化属性
        this.map = null;        // 地图对象
        this.points = [];       // 存储点位信息
        this.edges = [];        // 存储边信息
        this.currentMode = 'add-point';  // 当前模式
        this.currentPointName = '未命名'; // 当前点名称
        this.drawingEdge = false;        // 是否正在绘制边
        this.startPointIdx = null;       // 起点索引
        this.startMarker = null;         // 起点标记
        this.markers = [];      // 标记数组
        this.polylines = [];    // 线段数组
        this.pathPolyline = null; // 路径线段
        this.currentLocation = { // 当前定位
            name: '故宫博物院',
            center: [116.397029, 39.917839],
        };
        this.geocoder = null;   // 地理编码对象
        this.placeSearch = null; // 地点搜索对象
        this.autoComplete = null; // 自动完成对象
        
        // 初始化地图和UI
        this.initMap();
        this.initUI();
        this.initSearchTools();
    }

    // 初始化地图
    initMap() {
        // 创建地图实例，设置中心点为默认位置（故宫）
        this.map = new AMap.Map('map-container', {
            center: this.currentLocation.center,
            zoom: 16,
            viewMode: '3D',
            pitch: 35,
            mapStyle: 'amap://styles/normal'
        });
        
        // 添加基础控件
        this.map.addControl(new AMap.Scale());
        this.map.addControl(new AMap.ToolBar());
        
        // 加载地理定位插件
        AMap.plugin('AMap.Geolocation', () => {
            this.geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,  // 是否使用高精度定位，默认:true
                timeout: 10000,           // 超过10秒后停止定位，默认：5s
                buttonPosition: 'RB',     // 定位按钮的位置
                buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量
                zoomToAccuracy: true,     // 定位成功后是否自动调整地图视野到定位点
            });
            this.map.addControl(this.geolocation);
        });
        
        // 设置高德地图点击事件
        this.map.on('click', (e) => {
            this.handleMapClick(e);
        });
    }

    // 初始化搜索工具
    initSearchTools() {
        // 初始化地理编码工具
        this.geocoder = new AMap.Geocoder({
            city: "全国", // 城市，默认全国
            radius: 1000 // 范围，默认1000米
        });
        
        // 初始化地点搜索工具
        this.placeSearch = new AMap.PlaceSearch({
            city: '全国',
            pageSize: 1,
            pageIndex: 1
        });
        
        // 初始化自动完成工具
        this.autoComplete = new AMap.AutoComplete({
            city: '全国',
            input: 'location-search'
        });
        
        // 监听自动完成选择事件
        this.autoComplete.on('select', (e) => {
            if (e.poi && e.poi.location) {
                this.searchPlace(e.poi.name);
            }
        });
    }

    // 初始化UI
    initUI() {
        // 获取HTML元素
        this.pointNameInput = document.getElementById('point-name');
        this.pointsList = document.getElementById('points-list');
        this.pathInfo = document.getElementById('path-info');
        this.statusMessage = document.getElementById('status-message');
        this.locationSearch = document.getElementById('location-search');
        this.searchButton = document.getElementById('search-button');
        this.useCurrentLocationBtn = document.getElementById('use-current-location');
        
        // 模式按钮
        this.addPointModeBtn = document.getElementById('add-point-mode');
        this.addEdgeModeBtn = document.getElementById('add-edge-mode');
        this.deletePointModeBtn = document.getElementById('delete-point-mode');
        this.pathModeBtn = document.getElementById('path-mode');
        
        // 功能按钮
        this.saveDataBtn = document.getElementById('save-data');
        this.loadDataBtn = document.getElementById('load-data');
        this.addEdgeManuallyBtn = document.getElementById('add-edge-manually');
        this.resetViewBtn = document.getElementById('reset-view');
        
        // 设置事件监听
        this.pointNameInput.addEventListener('input', (e) => {
            this.currentPointName = e.target.value || '未命名';
        });
        
        // 搜索按钮事件
        this.searchButton.addEventListener('click', () => {
            const keyword = this.locationSearch.value.trim();
            if (keyword) {
                this.searchPlace(keyword);
            } else {
                this.showStatus('请输入地点名称', 'error');
            }
        });
        
        // 回车键触发搜索
        this.locationSearch.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const keyword = this.locationSearch.value.trim();
                if (keyword) {
                    this.searchPlace(keyword);
                }
            }
        });
        
        // 使用当前位置按钮事件
        this.useCurrentLocationBtn.addEventListener('click', () => {
            this.getCurrentPosition();
        });
        
        // 模式按钮点击事件
        this.addPointModeBtn.addEventListener('click', () => this.setMode('add-point'));
        this.addEdgeModeBtn.addEventListener('click', () => this.setMode('add-edge'));
        this.deletePointModeBtn.addEventListener('click', () => this.setMode('delete-point'));
        this.pathModeBtn.addEventListener('click', () => this.setMode('path'));
        
        // 功能按钮点击事件
        this.saveDataBtn.addEventListener('click', () => this.saveData());
        this.loadDataBtn.addEventListener('click', () => this.loadData());
        this.addEdgeManuallyBtn.addEventListener('click', () => this.addEdgeManually());
        this.resetViewBtn.addEventListener('click', () => this.resetView());
    }

    // 搜索地点
    searchPlace(keyword) {
        this.showStatus(`正在搜索: ${keyword}...`, 'info');
        
        this.placeSearch.search(keyword, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
                if (result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
                    const poi = result.poiList.pois[0];
                    
                    // 更新当前位置
                    this.currentLocation = {
                        name: poi.name,
                        center: [poi.location.lng, poi.location.lat]
                    };
                    
                    // 移动地图到搜索结果位置
                    this.map.setCenter(this.currentLocation.center);
                    this.map.setZoom(16);
                    
                    // 清空之前的点位和路径
                    this.resetAll();
                    
                    this.showStatus(`已定位到: ${this.currentLocation.name}`, 'success');
                } else {
                    this.showStatus('未找到该地点', 'error');
                }
            } else {
                this.showStatus('搜索失败，请重试', 'error');
            }
        });
    }

    // 获取当前位置
    getCurrentPosition() {
        this.showStatus('正在获取当前位置...', 'info');
        
        if (!this.geolocation) {
            this.showStatus('地理定位组件未加载，请稍后再试', 'error');
            return;
        }
        
        this.geolocation.getCurrentPosition((status, result) => {
            if (status === 'complete') {
                // 更新当前位置
                this.currentLocation = {
                    name: '当前位置',
                    center: [result.position.lng, result.position.lat]
                };
                
                // 移动地图到当前位置
                this.map.setCenter(this.currentLocation.center);
                this.map.setZoom(16);
                
                // 反向地理编码获取位置名称
                this.geocoder.getAddress(this.currentLocation.center, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        const address = result.regeocode.formattedAddress;
                        this.currentLocation.name = address;
                        this.locationSearch.value = address;
                        this.showStatus(`已定位到: ${address}`, 'success');
                    } else {
                        this.showStatus('已定位到当前位置', 'success');
                    }
                });
                
                // 清空之前的点位和路径
                this.resetAll();
                
            } else {
                this.showStatus('获取位置失败，请确认已允许位置权限', 'error');
                console.error('定位失败', result);
            }
        });
    }

    // 设置当前模式
    setMode(mode) {
        // 移除之前模式的active类
        this.addPointModeBtn.classList.remove('active');
        this.addEdgeModeBtn.classList.remove('active');
        this.deletePointModeBtn.classList.remove('active');
        this.pathModeBtn.classList.remove('active');
        
        // 设置新模式
        this.currentMode = mode;
        this.drawingEdge = false;
        
        // 添加当前模式的active类
        switch (mode) {
            case 'add-point':
                this.addPointModeBtn.classList.add('active');
                this.showStatus('点击地图添加标记点', 'info');
                break;
            case 'add-edge':
                this.addEdgeModeBtn.classList.add('active');
                this.showStatus('点击两个标记点创建连接', 'info');
                break;
            case 'delete-point':
                this.deletePointModeBtn.classList.add('active');
                this.showStatus('点击标记点进行删除', 'info');
                break;
            case 'path':
                this.pathModeBtn.classList.add('active');
                this.showStatus('首先点击起点，然后点击终点', 'info');
                break;
        }
    }

    // 处理地图点击事件
    handleMapClick(e) {
        const lngLat = e.lnglat;
        
        switch (this.currentMode) {
            case 'add-point':
                this.addPoint(lngLat);
                break;
            case 'path':
                // 路径模式下点击空白区域重置路径
                if (!this.startPointIdx) {
                    this.resetPath();
                }
                break;
        }
    }

    // 添加点
    addPoint(lngLat) {
        const pointId = this.points.length;
        const point = {
            id: pointId,
            name: this.currentPointName,
            lng: lngLat.getLng(),
            lat: lngLat.getLat()
        };
        
        // 创建标记
        const marker = new AMap.Marker({
            position: [point.lng, point.lat],
            title: point.name,
            label: {
                content: `${point.name} (${pointId})`,
                direction: 'right',
                offset: new AMap.Pixel(10, 0)
            }
        });
        
        // 为标记添加点击事件
        marker.on('click', (e) => {
            this.handleMarkerClick(pointId);
        });
        
        // 添加标记到地图
        this.map.add(marker);
        this.markers.push(marker);
        this.points.push(point);
        
        // 更新点位列表
        this.updatePointsList();
        this.showStatus(`添加点: ${point.name}`, 'success');
    }

    // 处理标记点点击事件
    handleMarkerClick(pointId) {
        const point = this.points[pointId];
        
        switch (this.currentMode) {
            case 'add-edge':
                if (!this.drawingEdge) {
                    // 开始绘制边
                    this.startPointIdx = pointId;
                    this.drawingEdge = true;
                    this.showStatus(`选择起点: ${point.name}`, 'info');
                } else {
                    // 完成边的绘制
                    const endPointIdx = pointId;
                    
                    // 避免自环
                    if (this.startPointIdx !== endPointIdx) {
                        this.addEdge(this.startPointIdx, endPointIdx);
                    } else {
                        this.showStatus(`不能连接点到自身`, 'error');
                    }
                    
                    this.drawingEdge = false;
                }
                break;
                
            case 'delete-point':
                this.deletePoint(pointId);
                break;
                
            case 'path':
                if (!this.startPointIdx) {
                    // 设置起点
                    this.startPointIdx = pointId;
                    this.showStatus(`设置起点: ${point.name}，请选择终点`, 'info');
                } else {
                    // 设置终点并计算路径
                    const endPointIdx = pointId;
                    
                    if (this.startPointIdx !== endPointIdx) {
                        this.calculatePath(this.startPointIdx, endPointIdx);
                    } else {
                        this.showStatus(`起点和终点不能相同`, 'error');
                    }
                    
                    this.startPointIdx = null; // 重置起点
                }
                break;
        }
    }

    // 添加边
    addEdge(startIdx, endIdx) {
        // 检查是否已存在相同的边
        const edgeExists = this.edges.some(edge => 
            (edge[0] === startIdx && edge[1] === endIdx) || 
            (edge[0] === endIdx && edge[1] === startIdx)
        );
        
        if (edgeExists) {
            this.showStatus(`边已存在`, 'error');
            return;
        }
        
        const startPoint = this.points[startIdx];
        const endPoint = this.points[endIdx];
        
        // 计算两点之间的实际距离（米）
        const distance = this.calculateDistance(
            startPoint.lng, startPoint.lat,
            endPoint.lng, endPoint.lat
        );
        
        // 添加边数据
        this.edges.push([startIdx, endIdx, distance]);
        
        // 创建折线
        const polyline = new AMap.Polyline({
            path: [
                [startPoint.lng, startPoint.lat],
                [endPoint.lng, endPoint.lat]
            ],
            strokeColor: '#3498db',
            strokeWeight: 3
        });
        
        // 创建边上的距离标签
        const midLng = (startPoint.lng + endPoint.lng) / 2;
        const midLat = (startPoint.lat + endPoint.lat) / 2;
        
        const distanceMarker = new AMap.Marker({
            position: [midLng, midLat],
            content: `<div class="distance-label">${distance.toFixed(1)}米</div>`,
            offset: new AMap.Pixel(-15, -15),
            anchor: 'center'
        });
        
        // 添加折线和距离标签到地图
        this.map.add(polyline);
        this.map.add(distanceMarker);
        this.polylines.push({ line: polyline, label: distanceMarker });
        
        this.showStatus(`添加边: ${startPoint.name} -- ${endPoint.name}, 距离: ${distance.toFixed(2)}米`, 'success');
    }

    // 手动添加边
    addEdgeManually() {
        if (this.points.length < 2) {
            this.showStatus('至少需要两个点才能添加边', 'error');
            return;
        }
        
        // 创建点位选择下拉列表HTML
        let pointsOptions = '';
        this.points.forEach(point => {
            pointsOptions += `<option value="${point.id}">${point.name} (${point.id})</option>`;
        });
        
        // 创建对话框
        const dialogHTML = `
            <div class="dialog-overlay">
                <div class="dialog-container">
                    <h3>手动添加边</h3>
                    <div class="dialog-content">
                        <div class="form-group">
                            <label>起点:</label>
                            <select id="start-point">${pointsOptions}</select>
                        </div>
                        <div class="form-group">
                            <label>终点:</label>
                            <select id="end-point">${pointsOptions}</select>
                        </div>
                        <div class="form-group">
                            <label>距离(米):</label>
                            <input type="number" id="edge-distance" value="0" min="0" step="any">
                        </div>
                    </div>
                    <div class="dialog-buttons">
                        <button id="cancel-dialog">取消</button>
                        <button id="confirm-dialog">确定</button>
                    </div>
                </div>
            </div>
        `;
        
        // 添加对话框到页面
        const dialogElement = document.createElement('div');
        dialogElement.innerHTML = dialogHTML;
        document.body.appendChild(dialogElement);
        
        // 添加对话框样式
        const style = document.createElement('style');
        style.textContent = `
            .dialog-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .dialog-container {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                min-width: 300px;
            }
            .dialog-content {
                margin: 15px 0;
            }
            .form-group {
                margin-bottom: 10px;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
            }
            .form-group select, .form-group input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .dialog-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
        `;
        document.head.appendChild(style);
        
        // 添加事件监听
        document.getElementById('cancel-dialog').addEventListener('click', () => {
            document.body.removeChild(dialogElement);
        });
        
        document.getElementById('confirm-dialog').addEventListener('click', () => {
            const startId = parseInt(document.getElementById('start-point').value);
            const endId = parseInt(document.getElementById('end-point').value);
            let distance = parseFloat(document.getElementById('end-point').value);
            
            // 如果距离为0或未填写，计算实际距离
            if (!distance || distance <= 0) {
                const startPoint = this.points[startId];
                const endPoint = this.points[endId];
                distance = this.calculateDistance(
                    startPoint.lng, startPoint.lat,
                    endPoint.lng, endPoint.lat
                );
            }
            
            // 验证输入
            if (startId === endId) {
                this.showStatus('不能连接点到自身', 'error');
            } else if (distance <= 0) {
                this.showStatus('距离必须大于0', 'error');
            } else {
                this.addEdge(startId, endId);
            }
            
            document.body.removeChild(dialogElement);
        });
    }

    // 删除点
    deletePoint(pointId) {
        const deletedPoint = this.points[pointId];
        
        // 移除地图上的标记
        this.map.remove(this.markers[pointId]);
        
        // 移除相关的边
        const edgesToRemove = [];
        this.edges = this.edges.filter((edge, idx) => {
            if (edge[0] === pointId || edge[1] === pointId) {
                edgesToRemove.push(idx);
                return false;
            }
            return true;
        });
        
        // 移除地图上的边
        edgesToRemove.forEach(idx => {
            if (idx < this.polylines.length) {
                this.map.remove(this.polylines[idx].line);
                this.map.remove(this.polylines[idx].label);
            }
        });
        this.polylines = this.polylines.filter((_, idx) => !edgesToRemove.includes(idx));
        
        // 移除点
        this.markers.splice(pointId, 1);
        this.points.splice(pointId, 1);
        
        // 更新剩余点的ID
        this.points.forEach((point, idx) => {
            point.id = idx;
        });
        
        // 更新边的引用
        this.edges = this.edges.map(edge => {
            return [
                edge[0] > pointId ? edge[0] - 1 : edge[0],
                edge[1] > pointId ? edge[1] - 1 : edge[1],
                edge[2]
            ];
        });
        
        // 更新标记的标签
        this.markers.forEach((marker, idx) => {
            marker.setLabel({
                content: `${this.points[idx].name} (${idx})`,
                direction: 'right',
                offset: new AMap.Pixel(10, 0)
            });
        });
        
        // 更新点位列表
        this.updatePointsList();
        this.showStatus(`已删除点: ${deletedPoint.name}`, 'success');
    }

    // 计算路径
    calculatePath(startIdx, endIdx) {
        // 构建邻接表
        const graph = this.buildGraph();
        
        // 使用Dijkstra算法计算最短路径
        const path = this.dijkstra(graph, startIdx, endIdx);
        
        if (!path) {
            this.showStatus('无法找到路径', 'error');
            return;
        }
        
        // 清除之前的路径
        this.resetPath();
        
        // 获取路径点
        const pathPoints = path.map(idx => this.points[idx]);
        
        // 计算总距离
        let totalDistance = 0;
        for (let i = 0; i < path.length - 1; i++) {
            const edge = this.edges.find(e => 
                (e[0] === path[i] && e[1] === path[i+1]) || 
                (e[0] === path[i+1] && e[1] === path[i])
            );
            
            if (edge) {
                totalDistance += edge[2];
            }
        }
        
        // 创建路径折线
        const pathCoordinates = pathPoints.map(point => [point.lng, point.lat]);
        this.pathPolyline = new AMap.Polyline({
            path: pathCoordinates,
            strokeColor: '#e74c3c',
            strokeWeight: 6,
            strokeOpacity: 0.8,
            strokeStyle: 'solid'
        });
        
        // 添加路径到地图
        this.map.add(this.pathPolyline);
        
        // 显示路径信息
        const pathNames = pathPoints.map(point => point.name).join(' → ');
        this.pathInfo.innerHTML = `
            <p><strong>路径:</strong> ${pathNames}</p>
            <p><strong>总距离:</strong> ${totalDistance.toFixed(2)}米</p>
        `;
        
        this.showStatus(`已找到路径，总距离: ${totalDistance.toFixed(2)}米`, 'success');
    }

    // 重置路径
    resetPath() {
        if (this.pathPolyline) {
            this.map.remove(this.pathPolyline);
            this.pathPolyline = null;
        }
        this.startPointIdx = null;
        this.pathInfo.innerHTML = '<p>未选择路径</p>';
    }

    // 构建图 (邻接表)
    buildGraph() {
        const graph = {};
        
        // 初始化
        this.points.forEach(point => {
            graph[point.id] = [];
        });
        
        // 添加边
        this.edges.forEach(edge => {
            const [startIdx, endIdx, distance] = edge;
            
            // 无向图需要双向添加
            graph[startIdx].push({node: endIdx, weight: distance});
            graph[endIdx].push({node: startIdx, weight: distance});
        });
        
        return graph;
    }

    // Dijkstra算法
    dijkstra(graph, startIdx, endIdx) {
        // 初始化
        const nodes = Object.keys(graph).map(Number);
        const distances = {};
        const previous = {};
        const unvisited = new Set(nodes);
        
        // 设置初始距离为无穷大
        nodes.forEach(node => {
            distances[node] = Infinity;
        });
        distances[startIdx] = 0;
        
        while (unvisited.size > 0) {
            // 找到未访问节点中距离最小的
            let current = null;
            let minDistance = Infinity;
            
            for (const node of unvisited) {
                if (distances[node] < minDistance) {
                    minDistance = distances[node];
                    current = node;
                }
            }
            
            // 如果当前节点是终点或无法到达其他节点，则结束
            if (current === endIdx || minDistance === Infinity) {
                break;
            }
            
            // 从未访问集合中移除当前节点
            unvisited.delete(current);
            
            // 更新邻居节点的距离
            for (const neighbor of graph[current]) {
                if (unvisited.has(neighbor.node)) {
                    const newDistance = distances[current] + neighbor.weight;
                    if (newDistance < distances[neighbor.node]) {
                        distances[neighbor.node] = newDistance;
                        previous[neighbor.node] = current;
                    }
                }
            }
        }
        
        // 构建路径
        if (distances[endIdx] === Infinity) {
            return null; // 无法到达终点
        }
        
        const path = [];
        let current = endIdx;
        while (current !== undefined) {
            path.unshift(current);
            current = previous[current];
        }
        
        return path;
    }

    // 计算两点之间的距离（米）
    calculateDistance(lng1, lat1, lng2, lat2) {
        // 使用高德地图API提供的计算距离方法
        const from = new AMap.LngLat(lng1, lat1);
        const to = new AMap.LngLat(lng2, lat2);
        return from.distance(to);
    }

    // 更新点位列表
    updatePointsList() {
        this.pointsList.innerHTML = '';
        
        if (this.points.length === 0) {
            this.pointsList.innerHTML = '<p>暂无点位</p>';
            return;
        }
        
        this.points.forEach(point => {
            const pointElement = document.createElement('div');
            pointElement.className = 'point-item';
            pointElement.textContent = `${point.id}: ${point.name} (${point.lng.toFixed(6)}, ${point.lat.toFixed(6)})`;
            pointElement.addEventListener('click', () => {
                // 点击列表项居中显示该点
                this.map.setCenter([point.lng, point.lat]);
                this.map.setZoom(17);
            });
            this.pointsList.appendChild(pointElement);
        });
    }

    // 保存数据到本地存储
    saveData() {
        const data = {
            points: this.points,
            edges: this.edges,
            location: this.currentLocation
        };
        
        try {
            const storageKey = `nav_data_${this.currentLocation.name.replace(/\s+/g, '_')}`;
            localStorage.setItem(storageKey, JSON.stringify(data));
            this.showStatus('数据保存成功！', 'success');
            
            // 也提供下载数据的功能
            this.downloadData(data);
        } catch (error) {
            this.showStatus(`保存失败: ${error.message}`, 'error');
        }
    }

    // 下载数据为JSON文件
    downloadData(data) {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        const fileName = `map_nav_${this.currentLocation.name.replace(/\s+/g, '_')}.json`;
        a.download = fileName;
        a.click();
        
        URL.revokeObjectURL(url);
    }

    // 从本地存储加载数据
    loadData() {
        try {
            // 列出所有保存的位置数据
            const savedLocations = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('nav_data_')) {
                    const locationName = key.replace('nav_data_', '').replace(/_/g, ' ');
                    savedLocations.push({ key, name: locationName });
                }
            }
            
            if (savedLocations.length === 0) {
                this.showStatus('没有找到保存的数据', 'error');
                return;
            }
            
            // 创建对话框列出所有保存的位置
            const dialogHTML = this.createLoadDialog(savedLocations);
            
            // 添加对话框到页面
            const dialogElement = document.createElement('div');
            dialogElement.innerHTML = dialogHTML;
            document.body.appendChild(dialogElement);
            
            // 添加对话框样式
            this.addDialogStyles();
            
            // 添加事件监听
            document.getElementById('cancel-load-dialog').addEventListener('click', () => {
                document.body.removeChild(dialogElement);
            });
            
            // 为每个位置添加加载事件
            savedLocations.forEach(location => {
                const button = document.getElementById(`load-${location.key}`);
                if (button) {
                    button.addEventListener('click', () => {
                        this.loadLocationData(location.key);
                        document.body.removeChild(dialogElement);
                    });
                }
            });
            
        } catch (error) {
            this.showStatus(`加载失败: ${error.message}`, 'error');
        }
    }
    
    // 创建加载对话框
    createLoadDialog(locations) {
        let locationsHTML = '';
        locations.forEach(location => {
            locationsHTML += `
                <div class="location-item">
                    <span>${location.name}</span>
                    <button id="load-${location.key}" class="load-location-btn">加载</button>
                </div>
            `;
        });
        
        return `
            <div class="dialog-overlay">
                <div class="dialog-container">
                    <h3>选择要加载的位置</h3>
                    <div class="dialog-content">
                        <div class="locations-list">
                            ${locationsHTML}
                        </div>
                    </div>
                    <div class="dialog-buttons">
                        <button id="cancel-load-dialog">取消</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    // 添加对话框样式
    addDialogStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .dialog-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            .dialog-container {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                min-width: 300px;
                max-width: 500px;
            }
            .dialog-content {
                margin: 15px 0;
                max-height: 300px;
                overflow-y: auto;
            }
            .form-group {
                margin-bottom: 10px;
            }
            .form-group label {
                display: block;
                margin-bottom: 5px;
            }
            .form-group select, .form-group input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .dialog-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            .locations-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .location-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 8px;
                border: 1px solid #eee;
                border-radius: 4px;
            }
            .load-location-btn {
                padding: 5px 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 加载特定位置的数据
    loadLocationData(key) {
        try {
            const data = localStorage.getItem(key);
            
            if (!data) {
                this.showStatus('没有找到保存的数据', 'error');
                return;
            }
            
            const parsedData = JSON.parse(data);
            
            // 重置当前数据
            this.resetAll();
            
            // 设置位置
            if (parsedData.location) {
                this.currentLocation = parsedData.location;
                this.map.setCenter(this.currentLocation.center);
                this.locationSearch.value = this.currentLocation.name;
            }
            
            // 加载点位
            parsedData.points.forEach(point => {
                const lngLat = new AMap.LngLat(point.lng, point.lat);
                this.currentPointName = point.name;
                this.addPoint(lngLat);
            });
            
            // 加载边
            parsedData.edges.forEach(edge => {
                this.addEdge(edge[0], edge[1], edge[2]);
            });
            
            this.showStatus('数据加载成功！', 'success');
        } catch (error) {
            this.showStatus(`加载失败: ${error.message}`, 'error');
        }
    }

    // 重置所有数据和视图
    resetAll() {
        // 清除所有标记和线
        this.map.remove(this.markers);
        this.polylines.forEach(polyline => {
            this.map.remove(polyline.line);
            this.map.remove(polyline.label);
        });
        if (this.pathPolyline) {
            this.map.remove(this.pathPolyline);
        }
        
        // 重置数据
        this.markers = [];
        this.polylines = [];
        this.points = [];
        this.edges = [];
        this.pathPolyline = null;
        this.startPointIdx = null;
        
        // 更新UI
        this.updatePointsList();
        this.pathInfo.innerHTML = '<p>未选择路径</p>';
    }

    // 重置视图到当前位置
    resetView() {
        this.map.setCenter(this.currentLocation.center);
        this.map.setZoom(16);
        this.map.setPitch(35);
    }

    // 显示状态消息
    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = 'status-message';
        
        if (type) {
            this.statusMessage.classList.add(type);
        }
        
        // 2秒后清除消息
        clearTimeout(this.statusTimeout);
        this.statusTimeout = setTimeout(() => {
            this.statusMessage.textContent = '';
            this.statusMessage.className = 'status-message';
        }, 3000);
    }
}

// 页面加载完成后初始化导航系统
window.onload = function() {
    const navigator = new MapNavigator();
};